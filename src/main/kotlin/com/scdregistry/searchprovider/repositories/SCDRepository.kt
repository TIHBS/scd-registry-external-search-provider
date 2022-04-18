package com.scdregistry.searchprovider.repositories

import com.scdregistry.searchprovider.entities.SCD
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository

interface SCDRepository : ElasticsearchRepository<SCD, String> {
    fun findByName(name: String, pageable: Pageable): Page<SCD>
    fun findByName(name: String): List<SCD>
}
