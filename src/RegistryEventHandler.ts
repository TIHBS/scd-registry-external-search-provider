import { BigNumber } from "ethers";
import { Registry } from "../external/scd-registry-common/src/wrappers/Registry.js";
import { IEventData, IRegistryEventHandler } from "./IRegistryEventHandler.js";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import {
  SCD,
  SCDWithID,
} from "../external/scd-registry-common/src/interfaces/SCD";
import fetch from "node-fetch";
import { SwarmClient } from "./SwarmClient.js";

interface EventData {
  id: BigNumber;
}

export class RegistryEventHandler implements IRegistryEventHandler {
  private registry: Registry;
  private elasticsearchClient: ElasticsearchClient;
  private swarmClient: SwarmClient;
  private elasticsearchIndex: string;

  constructor(
    registry: Registry,
    elasticsearchClient: ElasticsearchClient,
    swarmClient: SwarmClient,
    elasticsearchIndex = "scds"
  ) {
    this.registry = registry;
    this.elasticsearchClient = elasticsearchClient;
    this.swarmClient = swarmClient;
    this.elasticsearchIndex = elasticsearchIndex;
  }

  async onEvent(eventData: IEventData): Promise<boolean> {
    const id = (eventData as EventData).id;

    try {
      const scd = await this.fetchSCD(id);

      const scdWithId: SCDWithID = { id: id, scd: scd };

      await this.elasticsearchClient.index({
        index: this.elasticsearchIndex,
        document: scdWithId,
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

    let scd: SCD;
    if (url.startsWith("swarm://")) {
      scd = await this.swarmClient.fetch(url);
    } else {
      scd = await this.fetchFromWeb(url);
    }

    console.log(
      `Fetched SCD of a smart contract with the name: ${scd.name} and the contract hash: ${scd.hash}`
    );
    return scd;
  }

  private async fetchFromWeb(url: string): Promise<SCD> {
    return await (await fetch(url)).json();
  }

  public async createIndex() {
    if (
      await this.elasticsearchClient.indices.exists({
        index: this.elasticsearchIndex,
      })
    ) {
      console.log(`The index ${this.elasticsearchIndex} does already exist.`);
      return false;
    }

    console.log(`Created the ${this.elasticsearchIndex} index.`);
    const createdIndex = await this.elasticsearchClient.indices.create({
      index: this.elasticsearchIndex,
    });
    return createdIndex;
  }
}
