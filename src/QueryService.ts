import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { BigNumberish } from "ethers";
import { SCDWithIDAndMetadata } from "../external/scd-registry-common/src/interfaces/SCD";

export class QueryService {
  private elasticsearchClient: ElasticsearchClient;
  private elasticsearchIndex: string;

  constructor(
    elasticsearchClient: ElasticsearchClient,
    elasticsearchIndex = "scds"
  ) {
    this.elasticsearchClient = elasticsearchClient;
    this.elasticsearchIndex = elasticsearchIndex;
  }

  async query(
    query: string,
    onlyIds: boolean
  ): Promise<SCDWithIDAndMetadata[] | BigNumberish[]> {
    const esQuery = {
      multi_match: {
        query: query,
        fuzziness: "auto",
      },
    };

    const { hits } =
      await this.elasticsearchClient.search<SCDWithIDAndMetadata>({
        index: this.elasticsearchIndex,
        query: esQuery,
      });

    const results = hits.hits
      .map((hit) => hit._source)
      .filter((hit) => hit != undefined) as SCDWithIDAndMetadata[];

    return onlyIds ? results.map((scd) => scd.id) : results;
  }
}
