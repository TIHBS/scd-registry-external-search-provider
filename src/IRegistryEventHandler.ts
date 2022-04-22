export interface IEventData {}

export interface IRegistryEventHandler {
  onEvent(eventData: IEventData): Promise<boolean>;
}
