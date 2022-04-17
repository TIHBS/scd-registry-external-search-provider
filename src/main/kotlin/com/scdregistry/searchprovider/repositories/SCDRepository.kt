package com.scdregistry.searchprovider.repositories

import com.scdregistry.searchprovider.entities.SCD
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository

interface SCDRepository : ElasticsearchRepository<SCD, String> {
}
