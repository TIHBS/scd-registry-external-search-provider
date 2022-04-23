import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
import { SCD } from "../external/decentralised-scd-registry-common/src/interfaces/SCD";

export class QueryService {
  private elasticsearchClient: ElasticsearchClient;
  private elasticsearchIndex: string;

  // TODO: Fix missing fields and extend the querying capabilities.
  private static SCD_FIELD_NAMES = [
    "scdl_version",
    "name",
    "version",
    "latest_URL",
    "description",
    "author",
    // "created_on",
    // "updated_on",
    "life_cycle",
    "scl",
    "blockchain_type",
    "blockchain_version",
    "internal_address",
    "metadata",
    "hash",
    // "is_stateful",
    "functions",
    "events",
  ];

  constructor(
    elasticsearchClient: ElasticsearchClient,
    elasticsearchIndex = "scds"
  ) {
    this.elasticsearchClient = elasticsearchClient;
    this.elasticsearchIndex = elasticsearchIndex;
  }

  async query(query: string): Promise<SCD[]> {
    const esQuery = {
      combined_fields: {
        query: query,
        auto_generate_synonyms_phrase_query: true,
        fields: QueryService.SCD_FIELD_NAMES,
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
