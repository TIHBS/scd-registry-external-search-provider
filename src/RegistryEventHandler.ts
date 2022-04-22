import { BigNumber } from "ethers";
import { Registry } from "../external/decentralised-scd-registry/src/types/Registry.js";
import { IEventData, IRegistryEventHandler } from "./IRegistryEventHandler.js";
import fetch from "node-fetch";

interface EventData {
  id: BigNumber;
}

export class RegistryEventHandler implements IRegistryEventHandler {
  private registry: Registry;

  constructor(registry: Registry) {
    this.registry = registry;
  }

  async onEvent(eventData: IEventData): Promise<boolean> {
    throw new Error("Not implemented!");
  }
}
