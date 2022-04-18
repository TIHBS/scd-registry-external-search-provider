package com.scdregistry.searchprovider.controllers

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.services.SCDService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.random.Random


@RestController
class SearchProviderController @Autowired constructor(
    private val scdService: SCDService
) {
    private val random = Random(234325)

    @GetMapping("/")
    fun getDocument(@RequestParam query: String, pageable: Pageable): ResponseEntity<Page<SCD>> {
        scdService.save(SCD(random.nextLong(), "Blaaaa", "Bääär"))
        val result = scdService.findByName(query, pageable)
        return ResponseEntity.ok(result)
    }

    @PostMapping("/")
    fun storeDocument(@RequestBody scd: SCD): ResponseEntity<SCD> {
        val result = scdService.save(scd)
        return ResponseEntity.ok(result)
    }
}
