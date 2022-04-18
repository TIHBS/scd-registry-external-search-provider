package com.scdregistry.searchprovider.config

import mu.KLogger
import org.elasticsearch.client.RestHighLevelClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.RestClients
import org.springframework.data.elasticsearch.core.ElasticsearchOperations
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories

@Configuration
@EnableElasticsearchRepositories(basePackages = ["com.scdregistry.searchprovider.repositories"])
@ComponentScan(basePackages = ["com.scdregistry.searchprovider"])
class ElasticsearchConfig(private val logger: KLogger) {
    @Bean
    fun client(@Value("\${elasticsearch.url}") url: String): RestHighLevelClient {
        logger.info { "Connecting to Elasticsearch at $url" }
        val clientConfiguration = ClientConfiguration.builder()
            .connectedTo(url)
            .build()
        return RestClients.create(clientConfiguration).rest()
    }

    @Bean
    fun elasticsearchTemplate(client: RestHighLevelClient): ElasticsearchOperations {
        return ElasticsearchRestTemplate(client)
    }
}