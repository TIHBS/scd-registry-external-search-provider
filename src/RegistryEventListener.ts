import { BigNumber } from "ethers";
import {
  ContractRegisteredEventFilter,
  Registry,
} from "../external/decentralised-scd-registry-common/src/wrappers/Registry.js";
import { IRegistryEventHandler } from "./IRegistryEventHandler.js";

export class RegistryEventListener {
  private registry: Registry;
  private eventHandlers: Set<IRegistryEventHandler>;
  private filter: ContractRegisteredEventFilter;

  constructor(registry: Registry, filter: ContractRegisteredEventFilter) {
    this.registry = registry;
    this.filter = filter;
    this.eventHandlers = new Set<IRegistryEventHandler>();
  }

  public subscribe(eventHandler: IRegistryEventHandler) {
    this.eventHandlers.add(eventHandler);
  }

  public unsubscribe(eventHandler: IRegistryEventHandler) {
    this.eventHandlers.delete(eventHandler);
  }

  public start() {
    this.registry.on(this.filter, id => this.publish(id));
  }

  private publish(id: BigNumber) {
    console.log(`Registering SCD with id: ${id}`);
    this.eventHandlers.forEach(eventHandler => eventHandler.onEvent({ id: id }));
  }
}
