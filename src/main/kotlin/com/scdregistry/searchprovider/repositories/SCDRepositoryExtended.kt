package com.scdregistry.searchprovider.repositories

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.util.createFullTextQuery
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.elasticsearch.core.ElasticsearchOperations
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service

@Service
class SCDRepositoryExtended(
    private val scdRepository: SCDRepository,
    private val elasticsearchTemplate: ElasticsearchOperations
) : Repository<SCD, String> {
    fun findByName(name: String, pageable: Pageable): Page<SCD> {
        return scdRepository.findByName(name, pageable)
    }

    fun findByName(name: String): List<SCD> {
        return scdRepository.findByName(name)
    }

    fun save(scd: SCD): SCD {
        return scdRepository.save(scd)
    }

    fun saveAll(scds: Collection<SCD>): Iterable<SCD> {
        return scdRepository.saveAll(scds)
    }

    fun fullTextSearch(query: String): List<SCD> {
        val queryBuilder = createFullTextQuery(SCD::class.java, query)
        val searchQuery = NativeSearchQueryBuilder().withFilter(queryBuilder).build()
        val hits = elasticsearchTemplate.search(searchQuery, SCD::class.java, IndexCoordinates.of("scd"))

        return hits.searchHits.map { hit -> hit.content }
    }
}