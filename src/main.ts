import { ethers } from "ethers";
import { RegistryEventListener } from "./RegistryEventListener.js";
import { ExpressServer } from "./ExpressServer.js";
import { RegistryEventHandler } from "./RegistryEventHandler.js";
import { Provider } from "@ethersproject/abstract-provider/lib/index";
import { Registry__factory } from "../external/scd-registry-common/src/wrappers/factories/Registry__factory.js";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { QueryService } from "./QueryService.js";
import "dotenv/config";
import { SwarmClient } from "./SwarmClient.js";

async function createElasticsearchClient(
  elasticsearchUrl = process.env.ELASTICSEARCH_URL
    ? process.env.ELASTICSEARCH_URL
    : "http://localhost:9200"
): Promise<ElasticsearchClient> {
  console.log(`Connecting to Elasticsearch at ${elasticsearchUrl}`);

  const esClient = new ElasticsearchClient({
    node: elasticsearchUrl,
  });

  let connected = false;
  while (!connected) {
    try {
      connected = await esClient.ping();
    } catch (e) {}
  }
  return esClient;
}

async function createProvider(
  ethereumNetworkUrl = process.env.NETWORKISH
    ? process.env.NETWORKISH
    : "http://localhost:8545"
) {
  console.log(`Connecting to Ethereum network at ${ethereumNetworkUrl}`);
  return await ethers.getDefaultProvider(ethereumNetworkUrl);
}

function createRegistryContract(
  provider: Provider,
  contractAddress = process.env.REGISTRY_ADDRESS
    ? process.env.REGISTRY_ADDRESS
    : // This address seems to be the one that is used most of the time when the contract is deployed.
      "0x222E34DA1926A9041ed5A87f71580D4D27f84fD3"
) {
  console.log(`Connecting to Registry contract at ${contractAddress}`);
  return Registry__factory.connect(contractAddress, provider);
}

function createSwarmClient(): SwarmClient {
  const swarmUrl = process.env.SWARM_API
    ? process.env.SWARM_API
    : "http://localhost:1633";
  return new SwarmClient(swarmUrl);
}

async function main() {
  const provider = await createProvider();
  const registry = createRegistryContract(provider);
  const elasticsearchIndex = "scds";

  const registryEventListener = new RegistryEventListener(
    registry,
    registry.filters.ContractRegistered()
  );

  const elasticsearchClient = await createElasticsearchClient();
  const swarmClient = createSwarmClient();
  const eventHandler = new RegistryEventHandler(
    registry,
    elasticsearchClient,
    swarmClient,
    elasticsearchIndex
  );
  eventHandler.createIndex();
  registryEventListener.subscribe(eventHandler);
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
