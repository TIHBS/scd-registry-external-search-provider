import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { SCD } from "../external/decentralised-scd-registry-common/src/interfaces/SCD";

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

  async query(query: string): Promise<SCD[]> {
    const esQuery = {
      multi_match: {
        query: query,
        fuzziness: "auto",
      },
    };

    const { hits } = await this.elasticsearchClient.search<SCD>({
      index: this.elasticsearchIndex,
      query: esQuery,
    });

    const results = hits.hits
      .map((hit) => hit._source)
      .filter((hit) => hit != undefined) as SCD[];

    return results;
  }
}
