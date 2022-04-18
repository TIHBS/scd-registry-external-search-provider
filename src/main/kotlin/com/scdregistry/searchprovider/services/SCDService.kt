package com.scdregistry.searchprovider.services

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.repositories.SCDRepositoryExtended
import mu.KLogger
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class SCDService(
    private val logger: KLogger,
    private val scdRepositoryExtended: SCDRepositoryExtended
) {
    fun save(scd: SCD): SCD {
        val result = scdRepositoryExtended.save(scd)
        logger.info { "saved: $scd" }
        return result
    }

    fun save(scds: Collection<SCD>): Iterable<SCD> {
        val result = scdRepositoryExtended.saveAll(scds)
        logger.info { "saved: $scds" }
        return result
    }

    fun findByName(name: String): List<SCD> {
        return scdRepositoryExtended.findByName(name)
    }

    fun findByName(name: String, pageable: Pageable): Page<SCD> {
        return scdRepositoryExtended.findByName(name, pageable)
    }

    //  fun fullTextSearch(query: String): List<SCD> {
    //      val fullTextEntityManager = createFullTextEntityManager()
    //      val qb: QueryBuilder = fullTextEntityManager
    //          .searchFactory
    //          .buildQueryBuilder()
    //          .forEntity(SCD::class.java)
    //          .get()

    //      val foodQuery = qb.keyword()
    //          .onFields("name", "author")
    //          .matching(query)
    //          .createQuery()

    //      val fullTextQuery = fullTextEntityManager
    //          .createFullTextQuery(foodQuery, SCD::class.java)

    //      return fullTextQuery.resultList as List<SCD>
    //  }
}
