import { ethers } from "ethers";
import { RegistryEventListener } from "./RegistryEventListener.js";
import { ExpressServer } from "./ExpressServer.js";
import { RegistryEventHandler } from "./RegistryEventHandler.js";
import { Provider } from "@ethersproject/abstract-provider/lib/index";
import RegistryDeployment from "../external/decentralised-scd-registry/deployments/ganache-cli/Registry.json";
import { Registry__factory } from "../external/decentralised-scd-registry/src/types/factories/Registry__factory.js";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import "dotenv/config";
import { QueryService } from "./QueryService.js";

function createElasticsearchClient(
  elasticsearchUrl = process.env.ELASTICSEARCH_URL
    ? process.env.ELASTICSEARCH_URL
    : "http://localhost:9200"
): ElasticsearchClient {
  console.log(`Connecting to Elasticsearch at ${elasticsearchUrl}`);
  return new ElasticsearchClient({
    node: elasticsearchUrl,
  });
}

async function createProvider(
  ethereumNetworkUrl = process.env.ETHEREUM_NETWORK_URL
    ? process.env.ETHEREUM_NETWORK_URL
    : "http://localhost:8545"
) {
  console.log(`Connecting to Ethereum network at ${ethereumNetworkUrl}`);
  return await ethers.getDefaultProvider(ethereumNetworkUrl);
}

function createRegistryContract(
  provider: Provider,
  contractAddress = process.env.REGISTRY_ADDRESS
    ? process.env.REGISTRY_ADDRESS
    : RegistryDeployment.address
) {
  console.log(`Connecting to Registry contract at ${contractAddress}`);
  return Registry__factory.connect(contractAddress, provider);
}

async function main() {
  const provider = await createProvider();
  const registry = createRegistryContract(provider);
  const elasticsearchIndex = "scds";

  const registryEventListener = new RegistryEventListener(
    registry,
    registry.filters.ContractRegistered()
  );

  const elasticsearchClient = createElasticsearchClient();
  registryEventListener.subscribe(
    new RegistryEventHandler(registry, elasticsearchClient, elasticsearchIndex)
  );
  registryEventListener.start();

  const queryService = new QueryService(
    elasticsearchClient,
    elasticsearchIndex
  );
  const expressServer = new ExpressServer(queryService);

  expressServer.registerRoutes();
  expressServer.start();
}

main().then().catch();
