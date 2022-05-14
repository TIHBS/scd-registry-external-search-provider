import expect from "./expect";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { ElasticsearchEnvironment } from "./ElasticsearchEnvironment";

xdescribe("DockerComposeEnvironment", () => {
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

  it("client works", async () => {
    const testIndex = "test-index";
    const testDocument = { hello: "Hello", world: "World" };
    await elasticsearchClient.index({
      index: testIndex,
      document: testDocument,
    });

    await elasticsearchClient.indices.refresh({ index: testIndex });
    console.log(7);
    const esQuery = {
      multi_match: {
        query: "Hello World",
        fuzziness: "auto",
      },
    };

    const { hits } = await elasticsearchClient.search({
      index: testIndex,
      query: esQuery,
    });

    const results = hits.hits
      .map((hit) => hit._source)
      .filter((hit) => hit != undefined);

    expect(results).to.deep.equal([testDocument]);
  });
});
