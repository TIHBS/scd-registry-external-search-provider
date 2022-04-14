package com.example.kotlin.repositories

import com.example.kotlin.entities.SmartContract
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import javax.transaction.Transactional

@Repository
@Transactional(Transactional.TxType.MANDATORY)
interface SmartContractRepository : JpaRepository<SmartContract, Int> {
    fun findOneByName(name: String): SmartContract?
}
