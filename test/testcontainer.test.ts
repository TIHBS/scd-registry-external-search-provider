import { DockerComposeEnvironment } from "testcontainers";
import { resolve } from "path";
import expect from "./expect";

describe("DockerComposeEnvironment", () => {
  let environment;
  let host = "";
  let port = 9200;

  before(async function () {
    this.timeout(300000);

    const composeFilePath = resolve(__dirname, "..");
    const composeFile = "docker-compose.yml";

    environment = await new DockerComposeEnvironment(
      composeFilePath,
      composeFile
    ).up(["elasticsearch"]);

    const elasticsearchContainer = environment.getContainer("elasticsearch");
    (port = elasticsearchContainer.getMappedPort(9200)),
      (host = elasticsearchContainer.getHost());
  });

  after(async function () {
    this.timeout(300000);

    await environment.down();
  });

  it("works", async () => {});
});
