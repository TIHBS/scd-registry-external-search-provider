package com.scdregistry.searchprovider.services

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.repositories.SCDRepository
import mu.KLogger
import org.hibernate.search.jpa.FullTextEntityManager
import org.hibernate.search.jpa.Search
import org.hibernate.search.query.dsl.QueryBuilder
import org.springframework.stereotype.Service
import javax.persistence.EntityManager

@Service
class SCDService(
    private val em: EntityManager,
    private val logger: KLogger,
    private val scdRepository: SCDRepository
) {
    fun save(scd: SCD) {
        scdRepository.save(scd)
        logger.info { "saved: $scd" }
    }

    fun save(scds: Collection<SCD>) {
        scdRepository.saveAll(scds)
        logger.info { "saved: $scds" }
    }

    fun fullTextSearch(query: String): List<SCD> {
        val fullTextEntityManager = createFullTextEntityManager()
        val qb: QueryBuilder = fullTextEntityManager
            .searchFactory
            .buildQueryBuilder()
            .forEntity(SCD::class.java)
            .get()

        val foodQuery = qb.keyword()
            .onFields("name", "author")
            .matching(query)
            .createQuery()

        val fullTextQuery = fullTextEntityManager
            .createFullTextQuery(foodQuery, SCD::class.java)

        return fullTextQuery.resultList as List<SCD>
    }

    fun createFullTextEntityManager(): FullTextEntityManager {
        logger.info("Initiating indexing...")
        val fullTextEntityManager = Search.getFullTextEntityManager(em)
        fullTextEntityManager.createIndexer().startAndWait()
        logger.info("All entities indexed")
        return fullTextEntityManager
    }
}
