import { Registry } from "../external/decentralised-scd-registry-common/src/wrappers/Registry";
import { RegistryEventHandler } from "../src/RegistryEventHandler";
import { SwarmClient } from "../src/SwarmClient";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { RegistryEventListener } from "../src/RegistryEventListener";
import * as sinon from "sinon";
import { expect } from "./expect";
import { BigNumber } from "ethers";

describe("RegistryEventListener", () => {
  let swarmClientMock: SwarmClient;
  let registryMock: Registry;
  let elasticsearchClientMock: ElasticsearchClient;
  let eventListener: RegistryEventListener;
  let eventHandlers: RegistryEventHandler[];

  const theId = BigNumber.from(1);
  const theMetadata = {
    id: theId,
    metadata: {
      name: "Railway",
      author: "The Tank Engine",
      internalAddress: "0x2222",
      url: "swarm://dskfjkdsfjslkö",
      signature: "dasffafjafajfkla",
      version: "2.2",
      functions: [],
      events: [],
      isValid: true,
      blockChainType: 0,
    },
  };

  const expected = {
    name: "Railway",
    author: "The Tank Engine",
    hash: "jhadsöklfjaklmkknaöoie4375843z90jesafea#+afdaf",
  };

  before(async function () {
    swarmClientMock = { fetch: () => {} } as any as SwarmClient;

    registryMock = {
      retrieveById: () => {},
      // @ts-ignore
      on: (args: any | any[]) => eventListener.publish(BigNumber.from(8)),
    } as any as Registry;

    elasticsearchClientMock = {
      index: (input: any | any[]) => {},
    } as any as ElasticsearchClient;

    eventHandlers = [];
    for (let i = 0; i < 3; i++) {
      const eventHandler = new RegistryEventHandler(registryMock, elasticsearchClientMock, swarmClientMock);
      sinon.stub(eventHandler, "fetchFromWeb").returns(expected);
      eventHandlers.push(eventHandler);
    }

    sinon.stub(registryMock, "retrieveById").returns(theMetadata);
    sinon.stub(swarmClientMock, "fetch").returns(expected);
  });

  beforeEach(() => {
    eventListener = new RegistryEventListener(registryMock, {});
  });

  it("should call 'onEvent' of all event handlers once", () => {
    const spies = [];
    eventHandlers.forEach(handler => {
      spies.push(sinon.spy(handler, "onEvent"));
      eventListener.subscribe(handler);
    });

    eventListener.start();
    spies.forEach(spy => expect(spy.calledOnce).to.be.true);
  });

  it("should call 'onEvent' of two event handlers once", () => {
    const spies = [];

    spies.push(sinon.spy(eventHandlers[0], "onEvent"));
    eventListener.subscribe(eventHandlers[0]);
    spies.push(sinon.spy(eventHandlers[2], "onEvent"));
    eventListener.subscribe(eventHandlers[2]);

    eventListener.start();
    spies.forEach(spy => expect(spy.calledOnce).to.be.true);
  });

  it("should never call 'onEvent'", () => {
    const spies = [];
    eventHandlers.forEach(handler => {
      spies.push(sinon.spy(handler, "onEvent"));
    });

    eventListener.start();
    spies.forEach(spy => expect(spy.notCalled).to.be.true);
  });
});
