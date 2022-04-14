package com.example.kotlin.ether

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController
import org.web3j.helloworld.HelloWorld
import org.web3j.protocol.Web3j
import org.web3j.protocol.core.methods.response.EthAccounts


@RestController
class EtherController @Autowired constructor(
    private val helloWorld: HelloWorld, private val web3j: Web3j
) {

    @GetMapping("/accounts")
    fun getEthAccounts(): EthAccounts {
        return web3j.ethAccounts().send()
    }

    @GetMapping("/get")
    fun get(): ResponseEntity<String> {
        val result = helloWorld.Get().send()
        if (result.isEmpty()) {
            return ResponseEntity<String>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(result)
    }

    @PutMapping("/set")
    fun deployHelloWorld(message: String): ResponseEntity<HttpStatus> {
        val result = helloWorld.Set(message).send()
        if (result.isStatusOK) {
            return ResponseEntity<HttpStatus>(HttpStatus.CREATED);
        }
        return ResponseEntity.ok().build()
    }
}