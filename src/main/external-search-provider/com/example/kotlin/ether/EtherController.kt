package com.example.kotlin.ether

import com.example.kotlin.entities.SCD
import com.example.kotlin.repositories.SCDRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Pageable
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.web.bind.annotation.GetMapping
import kotlin.random.Random

@Document(indexName = "registry")
class SearchProviderController @Autowired constructor(
    private val scdRepository: SCDRepository
) {

    @GetMapping("/")
    fun getDocument() {
        scdRepository.save(SCD(Random(234325).nextLong(), "Blaaaa", "Bääär"))
        val result = scdRepository.findByAuthor("Bääär", Pageable.unpaged())
    }
}