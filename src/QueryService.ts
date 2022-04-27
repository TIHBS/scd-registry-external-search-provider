import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { SCDWithID } from "../external/decentralised-scd-registry-common/src/interfaces/SCD";

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

  async query(query: string): Promise<SCDWithID[]> {
    const esQuery = {
      multi_match: {
        query: query,
        fuzziness: "auto",
      },
    };

    const { hits } = await this.elasticsearchClient.search<SCDWithID>({
      index: this.elasticsearchIndex,
      query: esQuery,
    });

    const results = hits.hits
      .map((hit) => hit._source)
      .filter((hit) => hit != undefined) as SCDWithID[];

    return results;
  }
}
