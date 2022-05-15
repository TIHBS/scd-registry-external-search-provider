import { expect } from "./expect";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { ElasticsearchEnvironment, storeDocuments } from "./util/ElasticsearchEnvironment";
import { QueryService } from "../src/QueryService";
import { testDocuments } from "./util/TestDocuments";

describe("QueryService", () => {
  let elasticsearchClient: ElasticsearchClient;
  let elasticsearchEnvironment: ElasticsearchEnvironment;

  before(async function () {
    this.timeout(300000);

    elasticsearchEnvironment = new ElasticsearchEnvironment();
    await elasticsearchEnvironment.start();
    const containerUrl = elasticsearchEnvironment.getUrl();
    elasticsearchClient = new ElasticsearchClient({ node: containerUrl });
  });

  after(async function () {
    this.timeout(300000);
    await elasticsearchEnvironment.down();
  });

  describe("Complete scds", () => {
    it("should query one scd", async () => {
      const testIndex = "scds1";
      await storeDocuments(elasticsearchClient, testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("Bitcoin", false);

      expect(result).to.have.deep.members([testDocuments[2]]);
    });

    it("should query two scds", async () => {
      const testIndex = "scds2";
      await storeDocuments(elasticsearchClient, testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("3", false);

      expect(result).to.have.deep.members([testDocuments[1], testDocuments[0]]);
    });

    it("should query no scds", async () => {
      const testIndex = "scds3";
      await storeDocuments(elasticsearchClient, testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("4327543286243870432920ß", false);

      expect(result).to.be.empty;
    });
  });

  describe("Only ids", () => {
    it("should query one scd id", async () => {
      const testIndex = "scds4";
      await storeDocuments(elasticsearchClient, testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("Bitcoin", true);

      expect(result).to.have.deep.members([testDocuments[2].id]);
    });

    it("should query two scds ids", async () => {
      const testIndex = "scds5";
      await storeDocuments(elasticsearchClient, testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("3", true);

      expect(result).to.have.deep.members([testDocuments[1].id, testDocuments[0].id]);
    });

    it("should query no scds ids", async () => {
      const testIndex = "scds6";
      await storeDocuments(elasticsearchClient, testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("4327543286243870432920ß", true);

      expect(result).to.be.empty;
    });
  });
});
