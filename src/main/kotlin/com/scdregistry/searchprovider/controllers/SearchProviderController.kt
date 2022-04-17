package com.scdregistry.searchprovider.controllers

import com.scdregistry.searchprovider.entities.SCD
import com.scdregistry.searchprovider.services.SCDService
import mu.KLogger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.random.Random


@RestController
class SearchProviderController @Autowired constructor(
    private val logger: KLogger,
    private val scdService: SCDService
) {
    private val random = Random(234325)

    @GetMapping("/")
    fun getDocument(@RequestParam query: String, pageable: Pageable): Page<SCD?>? {

        scdService.save(SCD(random.nextLong(), "Blaaaa", "Bääär"))
        val scds = scdService.fullTextSearch(query)

        val start = pageable.offset.toInt()
        var end = start + pageable.pageSize
        if (end > scds.size) {
            end = scds.size
        }
        return PageImpl(scds.subList(start, end), pageable, scds.size.toLong())
    }


}