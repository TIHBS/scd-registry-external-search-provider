import { ExpressServer } from "../src/ExpressServer";
import { chai, should } from "./expect";
import {
  ElasticsearchEnvironment,
  storeDocuments,
} from "./util/ElasticsearchEnvironment";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { QueryService } from "../src/QueryService";
import { uniqueId } from "lodash";
import { testDocuments } from "./util/TestDocuments";

describe("ExpressServer", () => {
  let server: ExpressServer;
  let queryService: QueryService;
  let elasticsearchClient: ElasticsearchClient;
  let elasticsearchEnvironment: ElasticsearchEnvironment;
  let index: string;

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

  beforeEach(() => {
    index = uniqueId("index-");
    queryService = new QueryService(elasticsearchClient, index);
    server = new ExpressServer(queryService);
    storeDocuments(elasticsearchClient, index, testDocuments);
  });

  describe("GET", () => {
    it("should receive 404", (done) => {
      chai
        .request(server.app)
        .get("/asdsadadluj")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
