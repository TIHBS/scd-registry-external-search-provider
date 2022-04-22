import { BigNumber } from "ethers";
import { Registry } from "../external/decentralised-scd-registry/src/types/Registry.js";
import { IEventData, IRegistryEventHandler } from "./IRegistryEventHandler.js";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import fetch from "node-fetch";

interface EventData {
  id: BigNumber;
}

export class RegistryEventHandler implements IRegistryEventHandler {
  private registry: Registry;
  private elasticsearchClient: ElasticsearchClient;
  private elasticsearchIndex: string;

  constructor(
    registry: Registry,
    elasticsearchClient: ElasticsearchClient,
    elasticsearchIndex = "scds"
  ) {
    this.registry = registry;
    this.elasticsearchClient = elasticsearchClient;
    this.elasticsearchIndex = elasticsearchIndex;
  }

  async onEvent(eventData: IEventData): Promise<boolean> {
    const id = (eventData as EventData).id;
    const scdMetadata = await this.registry.retrieveById(id);
    const onlyMetadata = scdMetadata.metadata;
    const url = process.env.PROXY_URL + onlyMetadata.url;
    console.log(`Fetching SCD from ${url}`);
    const scd = await (await fetch(url)).json();
    console.log(
      `Fetched SCD of a smart contract with the name: ${scd["Name"]} and the Hash ${scd["Hash"]}`
    );

    this.elasticsearchClient.index({
      index: this.elasticsearchIndex,
      document: scd,
    });
    console.log(`Stored ${scd["Name"]}`);

    return true;
  }
}
