package com.example.kotlin.repositories

import com.example.kotlin.entities.SCD
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository
import org.springframework.stereotype.Repository

@Repository
interface SCDRepository : ElasticsearchRepository<SCD, String> {
    fun findByAuthor(name: String?, pageable: Pageable?): Page<SCD?>?
}
