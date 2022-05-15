import { resolve } from "path";
import {
  DockerComposeEnvironment,
  DownedDockerComposeEnvironment,
  StartedDockerComposeEnvironment,
  StoppedDockerComposeEnvironment,
  Wait,
} from "testcontainers";

export class ElasticsearchEnvironment {
  private environment:
    | DockerComposeEnvironment
    | StartedDockerComposeEnvironment
    | StoppedDockerComposeEnvironment
    | DownedDockerComposeEnvironment;
  private static containerName = "elasticsearch";
  constructor() {
    const composeFilePath = resolve(__dirname, ".");
    const composeFile = "docker-compose.yml";

    this.environment = new DockerComposeEnvironment(
      composeFilePath,
      composeFile
    );
  }

  public async start() {
    this.environment = await (this.environment as DockerComposeEnvironment)
      .withWaitStrategy(
        ElasticsearchEnvironment.containerName,
        Wait.forLogMessage(
          "successfully loaded geoip database file [GeoLite2-City.mmdb]"
        )
      )
      .up([ElasticsearchEnvironment.containerName]);
  }

  public getUrl(): string {
    const container = (
      this.environment as StartedDockerComposeEnvironment
    ).getContainer(ElasticsearchEnvironment.containerName);
    return `http://${container.getHost()}:${container.getMappedPort(9200)}`;
  }

  public async stop() {
    this.environment = await (
      this.environment as StartedDockerComposeEnvironment
    ).stop();
  }

  public async down() {
    this.environment = await (
      this.environment as
        | StartedDockerComposeEnvironment
        | StoppedDockerComposeEnvironment
    ).down();
  }
}
