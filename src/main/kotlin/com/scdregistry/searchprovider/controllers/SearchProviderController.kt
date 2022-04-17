package com.scdregistry.searchprovider.controllers

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.repositories.SCDRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import kotlin.random.Random


@RestController
class SearchProviderController @Autowired constructor(
    private val scdRepository: SCDRepository
) {

    @GetMapping("/")
    fun getDocument(): Page<SCD?>? {
        scdRepository.save(SCD(Random(234325).nextLong(), "Blaaaa", "Bääär"))
        return scdRepository.findByAuthor("Bääär", Pageable.ofSize(10))
    }
}