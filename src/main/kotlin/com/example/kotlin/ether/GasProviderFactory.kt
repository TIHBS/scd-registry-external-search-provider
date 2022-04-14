package com.example.kotlin.ether

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.web3j.tx.gas.ContractGasProvider
import org.web3j.tx.gas.StaticGasProvider
import java.math.BigInteger

@Service
class GasProviderFactory {
    private val defaultPrice: BigInteger;
    private val defaultLimit: BigInteger;

    @Autowired
    constructor(
        @Value("\${ethereum.gas.price}") defaultPrice: Long,
        @Value("\${ethereum.gas.limit}") defaultLimit: Long
    ) {
        this.defaultPrice = BigInteger.valueOf(defaultPrice)
        this.defaultLimit = BigInteger.valueOf(defaultLimit)
    }

    fun createGasProvider(
        price: BigInteger = this.defaultPrice,
        limit: BigInteger = this.defaultLimit
    ): ContractGasProvider {
        return StaticGasProvider(price, limit)
    }
}