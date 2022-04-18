package com.scdregistry.searchprovider.controllers

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.services.SCDService
import com.scdregistry.searchprovider.util.listToPageable
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
class SearchProviderController @Autowired constructor(
    private val scdService: SCDService
) {
    @GetMapping("/")
    fun getDocument(
        @RequestParam query: String?,
        @RequestParam name: String?,
        pageable: Pageable
    ): ResponseEntity<Page<SCD>> {
        if (name != null) {
            val result = scdService.findByName(name, pageable)
            return ResponseEntity.ok(result)
        }
        if (query != null) {
            val result = scdService.fullTextSearch(query)
            return ResponseEntity.ok(listToPageable(result, pageable))
        }
        return ResponseEntity.ok(listToPageable(emptyList(), pageable))
    }

    @PostMapping("/")
    fun storeDocument(@RequestBody scd: SCD): ResponseEntity<SCD> {
        val result = scdService.save(scd)
        return ResponseEntity.ok(result)
    }
}
