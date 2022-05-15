import { expect } from "./expect";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { RegistryEventHandler } from "../src/RegistryEventHandler";
import { Registry } from "../external/decentralised-scd-registry-common/src/wrappers/Registry";
import { SwarmClient } from "../src/SwarmClient";
import * as sinon from "sinon";
import { BigNumber } from "ethers";
import { cloneDeep } from "lodash";

describe("RegistryEventHandler", () => {
  let swarmClientMock: SwarmClient;
  let registryMock: Registry;
  let elasticsearchClientMock: ElasticsearchClient;
  let eventHandler: RegistryEventHandler;

  const theId = BigNumber.from(1);
  const theMetadata = {
    id: theId,
    metadata: {
      name: "Railway",
      author: "The Tank Engine",
      internalAddress: "0x2222",
      url: "TO BE CHANGED",
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
    } as any as Registry;
    elasticsearchClientMock = {
      index: (input: any | any[]) => {},
    } as any as ElasticsearchClient;
  });

  beforeEach(() => {
    eventHandler = new RegistryEventHandler(
      registryMock,
      elasticsearchClientMock,
      swarmClientMock
    );
  });

  describe("onEvent", () => {
    it("should return true", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.url = "http://localhost:4242";
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      sinon.stub(eventHandler, "fetchFromWeb").returns(expected);

      const result = await eventHandler.onEvent({ id: theId });
      expect(result).to.be.true;
    });

    it("should also return true", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.url = "swarm://efsfeskfjesfnsekjfbeslkj";
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      sinon.stub(swarmClientMock, "fetch").returns(expected);

      const result = await eventHandler.onEvent({ id: theId });
      expect(result).to.be.true;
    });

    it("should return false", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.url = "http://localhost:4242";
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      sinon.stub(eventHandler, "fetchFromWeb").returns(expected);
      sinon.stub(elasticsearchClientMock, "index").throws();
      const result = await eventHandler.onEvent({ id: theId });
      expect(result).to.be.false;
    });
  });

  describe("fetchSCD", () => {
    it("should fetch the scd from swarm", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.url = "swarm://efsfeskfjesfnsekjfbeslkj";
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      sinon.stub(swarmClientMock, "fetch").returns(expected);
      // @ts-ignore
      const result = await eventHandler.fetchSCD(theId);
      expect(result).to.deep.equal(expected);
    });

    it("should fetch the scd from a webserver", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.url = "http://localhost:4242";
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      sinon.stub(eventHandler, "fetchFromWeb").returns(expected);
      // @ts-ignore
      const result = await eventHandler.fetchSCD(theId);
      expect(result).to.deep.equal(expected);
    });

    it("should should be rejected because the SCD is invalid", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.isValid = false;
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      // @ts-ignore
      await expect(eventHandler.fetchSCD(theId)).to.be.rejectedWith(
        "No SCD with this id exists!"
      );
    });
  });
});
