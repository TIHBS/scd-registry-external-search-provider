import { BigNumber } from "ethers";

export interface IEventData {
  id: BigNumber;
}

export interface IRegistryEventHandler {
  name: string;
  onEvent(eventData: IEventData): Promise<boolean>;
}
