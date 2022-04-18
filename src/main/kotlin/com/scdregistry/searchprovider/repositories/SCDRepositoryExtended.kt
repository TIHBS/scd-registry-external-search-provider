package com.scdregistry.searchprovider.repositories

import com.scdregistry.searchprovider.entities.SCD
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service

@Service
class SCDRepositoryExtended(private val scdRepository: SCDRepository) : Repository<SCD, String> {
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
}
