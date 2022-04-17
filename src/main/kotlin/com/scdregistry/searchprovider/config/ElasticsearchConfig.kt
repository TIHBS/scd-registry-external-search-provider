package com.scdregistry.searchprovider.config

import mu.KLogger
import org.elasticsearch.client.RestHighLevelClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.RestClients
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories


@Configuration
@EnableElasticsearchRepositories(basePackages = ["com.scdregistry.searchprovider.repositories"])
@ComponentScan(basePackages = ["com.scdregistry.searchprovider"])
class ElasticsearchConfig(
    private val logger: KLogger,
) : AbstractElasticsearchConfiguration() {

    @Bean
    @Override
    override fun elasticsearchClient(): RestHighLevelClient {
        val clientConfiguration: ClientConfiguration = ClientConfiguration.builder()
            .connectedTo("localhost:9200")
            .build()
        return RestClients.create(clientConfiguration).rest()
    }

}