import { Bee, Reference } from "@ethersphere/bee-js";
import { SCD } from "../external/decentralised-scd-registry-common/src/interfaces/SCD";

export class SwarmClient {
  private swarmUrl: string;
  constructor(swarmUrl: string) {
    this.swarmUrl = swarmUrl;
  }

  async fetch(url: string): Promise<SCD> {
    const bee = new Bee(this.swarmUrl);

    const reference = url.substring(8, url.length) as Reference;
    const result = await bee.downloadFile(reference);

    return JSON.parse(result.data.text());
  }
}
