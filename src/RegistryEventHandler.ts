import { BigNumber } from "ethers";
import { Registry } from "../external/decentralised-scd-registry/src/types/Registry.js";
import { IEventData, IRegistryEventHandler } from "./IRegistryEventHandler.js";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { SCD } from "../external/decentralised-scd-registry-common/src/interfaces/SCD";
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

    try {
      const scd = await this.fetchSCD(id);

      this.elasticsearchClient.index({
        index: this.elasticsearchIndex,
        document: scd,
      });
      console.log(`Stored ${scd.name}`);

      return true;
    } catch (error) {
      console.error(
        `Could not process the SCD with the id ${id} for the following reason:`
      );
      console.error(error);
      return false;
    }
  }

  private async fetchSCD(id: BigNumber): Promise<SCD> {
    const scdMetadata = await this.registry.retrieveById(id);
    const onlyMetadata = scdMetadata.metadata;

    if (!onlyMetadata.isValid) {
      throw new Error("No SCD with this id exists!");
    }

    console.log(
      `Fetched metadata of an SCD from the blockchain with the name: ${onlyMetadata.name} and the signature: ${onlyMetadata.signature}`
    );

    const url = onlyMetadata.url;
    console.log(`Fetching SCD from ${url}`);
    const scd = (await (await fetch(url)).json()) as SCD;
    console.log(
      `Fetched SCD of a smart contract with the name: ${scd.name} and the contract hash: ${scd.hash}`
    );
    return scd;
  }
}
