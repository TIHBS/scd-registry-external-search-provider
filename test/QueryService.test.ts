import expect from "./expect";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { ElasticsearchEnvironment } from "./util/ElasticsearchEnvironment";
import { QueryService } from "../src/QueryService";

describe("QueryService", () => {
  let elasticsearchClient: ElasticsearchClient;
  let elasticsearchEnvironment: ElasticsearchEnvironment;

  async function storeDocuments(index: string, documents: Object[]) {
    await Promise.all(
      documents.map(
        async (testDocument) =>
          await elasticsearchClient.index({
            index: index,
            document: testDocument,
          })
      )
    );

    await elasticsearchClient.indices.refresh({ index: index });
  }

  const testDocuments = [
    {
      id: 1,
      scd: {
        scdl_version: "3",
        name: "dogeCoin",
        version: "42",
        latest_URL: "http://iufzejfas.net/latest/",
        description: "Money",
        author: "Someone",
      },
    },
    {
      id: 2,
      scd: {
        scdl_version: "3",
        name: "Ethereum",
        version: "422",
        latest_URL: "http://iufzsdsfejfas.net/latest/",
        description: "Moneyy",
        author: "Someonee",
      },
    },
    {
      id: 3,
      scd: {
        scdl_version: "3.7",
        name: "Bitcoin",
        version: "4222",
        latest_URL: "http://iufzejttttfas.net/latest/",
        description: "Moneyyy",
        author: "Someoneee",
      },
    },
    {
      id: 4,
      scd: {
        scdl_version: "3.10",
        name: "quaCoin",
        version: "42222",
        latest_URL: "http://iufzejfhzjzujas.net/latest/",
        description: "Moneyyyy",
        author: "Someoneeee",
      },
    },
  ];

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
      await storeDocuments(testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("Bitcoin", false);

      expect(result).to.have.deep.members([testDocuments[2]]);
    });

    it("should query two scds", async () => {
      const testIndex = "scds2";
      await storeDocuments(testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("3", false);

      expect(result).to.have.deep.members([testDocuments[1], testDocuments[0]]);
    });

    it("should query no scds", async () => {
      const testIndex = "scds3";
      await storeDocuments(testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("4327543286243870432920ß", false);

      expect(result).to.be.empty;
    });
  });

  describe("Only ids", () => {
    it("should query one scd id", async () => {
      const testIndex = "scds4";
      await storeDocuments(testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("Bitcoin", true);

      expect(result).to.have.deep.members([testDocuments[2].id]);
    });

    it("should query two scds ids", async () => {
      const testIndex = "scds5";
      await storeDocuments(testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("3", true);

      expect(result).to.have.deep.members([
        testDocuments[1].id,
        testDocuments[0].id,
      ]);
    });

    it("should query no scds ids", async () => {
      const testIndex = "scds6";
      await storeDocuments(testIndex, testDocuments as Object[]);

      const queryService = new QueryService(elasticsearchClient, testIndex);
      const result = await queryService.query("4327543286243870432920ß", true);

      expect(result).to.be.empty;
    });
  });
});
