package com.example.kotlin.config

import com.example.kotlin.entities.SmartContract
import com.example.kotlin.ether.GasProviderFactory
import com.example.kotlin.repositories.SmartContractRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import org.web3j.crypto.Credentials
import org.web3j.helloworld.HelloWorld
import org.web3j.protocol.Web3j
import org.web3j.protocol.http.HttpService
import javax.transaction.Transactional

@Component
class EtherConfig {

    @Bean
    fun getWeb3j(@Value("\${ethereum.url}") url: String): Web3j {
        return Web3j.build(HttpService(url))
    }

    @Bean
    fun getCredentials(@Value("\${ethereum.key.private}") privateKey: String): Credentials {
        return Credentials.create(privateKey)
    }

    @Bean
    @Transactional
    fun getHelloWorld(
        smartContractRepository: SmartContractRepository,
        web3j: Web3j,
        credentials: Credentials,
        gasProviderFactory: GasProviderFactory
    ): HelloWorld {
        var smartContract = smartContractRepository.findOneByName(HelloWorld::class.simpleName!!)
        val gasProvider = gasProviderFactory.createGasProvider()

        if (smartContract == null) {
            val helloWorld = HelloWorld.deploy(web3j, credentials, gasProvider).send()
            smartContract = SmartContract(helloWorld.contractAddress, HelloWorld::class.simpleName!!)
            smartContractRepository.save(smartContract)
            return helloWorld
        } else {
            var helloWorld = HelloWorld.load(smartContract.address, web3j, credentials, gasProvider)
            if (helloWorld.isValid) {
                return helloWorld
            }
            helloWorld = HelloWorld.deploy(web3j, credentials, gasProvider).send()
            smartContract.address = helloWorld.contractAddress
            return helloWorld
        }
    }
}