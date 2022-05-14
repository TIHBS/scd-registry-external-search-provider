import expect from "./expect";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { ElasticsearchEnvironment } from "./ElasticsearchEnvironment";
import { RegistryEventHandler } from "../src/RegistryEventHandler";
import { Registry } from "../external/decentralised-scd-registry-common/src/wrappers/Registry";
import { SwarmClient } from "../src/SwarmClient";
import * as sinon from "sinon";
import { BigNumber } from "ethers";
import { cloneDeep } from "lodash";

describe("RegistryEventHandler", () => {
  let elasticsearchClient: ElasticsearchClient;
  let elasticsearchEnvironment: ElasticsearchEnvironment;
  let swarmClientMock: SwarmClient;
  let registryMock: Registry;

  before(async function () {
    this.timeout(300000);

    elasticsearchEnvironment = new ElasticsearchEnvironment();

    await elasticsearchEnvironment.start();
    const containerUrl = elasticsearchEnvironment.getUrl();
    elasticsearchClient = new ElasticsearchClient({ node: containerUrl });

    swarmClientMock = { fetch: () => {} } as any as SwarmClient;
    registryMock = {
      retrieveById: () => {},
    } as any as Registry;
  });

  after(async function () {
    this.timeout(300000);
    await elasticsearchEnvironment.down();
  });

  describe("fetchSCD", () => {
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
    let eventHandler: RegistryEventHandler;

    beforeEach(() => {
      eventHandler = new RegistryEventHandler(
        registryMock,
        elasticsearchClient,
        swarmClientMock
      );
    });

    it("should fetch the scd from swarm", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.url = "swarm://efsfeskfjesfnsekjfbeslkj";
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      sinon.stub(swarmClientMock, "fetch").returns(expected);
      const result = await eventHandler.fetchSCD(theId);
      expect(result).to.deep.equal(expected);
    });

    it("should fetch the scd from a webserver", async () => {
      const metadata = cloneDeep(theMetadata);
      metadata.metadata.url = "http://localhost:4242";
      sinon.stub(registryMock, "retrieveById").returns(metadata);
      sinon.stub(eventHandler, "fetchFromWeb").returns(expected);
      const result = await eventHandler.fetchSCD(theId);
      expect(result).to.deep.equal(expected);
    });
  });
});
