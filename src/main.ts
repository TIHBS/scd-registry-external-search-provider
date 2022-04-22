import { ethers } from "ethers";
import { RegistryEventListener } from "./RegistryEventListener.js";
import { ExpressServer } from "./ExpressServer.js";
import { RegistryEventHandler } from "./RegistryEventHandler.js";

import RegistryDeployment from "../external/decentralised-scd-registry/deployments/ganache-cli/Registry.json";
import { Registry__factory } from "../external/decentralised-scd-registry/src/types/factories/Registry__factory.js";
import "dotenv/config";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";

async function main() {
  const elasticsearchUrl = process.env.ELASTICSEARCH_URL
    ? process.env.ELASTICSEARCH_URL
    : "http://localhost:9200";

  console.log(`Connecting to Elasticsearch at ${elasticsearchUrl}`);
  const elasticsearchClient = new ElasticsearchClient({
    node: elasticsearchUrl,
  });

  const ethereumNetworkUrl = process.env.ETHEREUM_NETWORK_URL
    ? process.env.ETHEREUM_NETWORK_URL
    : "http://localhost:8545";

  console.log(`Connecting to Ethereum network at ${ethereumNetworkUrl}`);

  const contractAddress = process.env.REGISTRY_ADDRESS
    ? process.env.REGISTRY_ADDRESS
    : RegistryDeployment.address;

  console.log(`Connecting to Registry contract at ${contractAddress}`);
  const signer = await ethers.getDefaultProvider(ethereumNetworkUrl);
  const registry = Registry__factory.connect(contractAddress, signer);

  const registryEventListener = new RegistryEventListener(
    registry,
    registry.filters.ContractRegistered()
  );

  registryEventListener.subscribe(new RegistryEventHandler(registry));
  registryEventListener.start();

  const expressServer = new ExpressServer();

  expressServer.registerRoutes();
  expressServer.start();
}

main().then().catch();
