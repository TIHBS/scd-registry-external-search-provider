package com.scdregistry.searchprovider.controllers

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.repositories.SCDRepository
import mu.KLogger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import kotlin.random.Random


@RestController
class SearchProviderController @Autowired constructor(
    private val scdRepository: SCDRepository, private val logger: KLogger
) {
    private val random = Random(234325)

    @GetMapping("/")
    fun getDocument(): Page<SCD?>? {
        val scd = SCD(random.nextLong(), "Blaaaa", "Bääär")
        scdRepository.save(scd)
        logger.info { "saved: ${scd.toString()}" }

        val result = scdRepository.findByAuthor("Bääär", Pageable.ofSize(10))
        logger.info { "found: ${result.toString()}" }

        return result
    }
}