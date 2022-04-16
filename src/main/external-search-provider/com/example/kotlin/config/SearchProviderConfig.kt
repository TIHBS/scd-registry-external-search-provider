package com.example.kotlin.config

import org.elasticsearch.client.RestHighLevelClient
import org.springframework.beans.factory.annotation.Autowired
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
@EnableElasticsearchRepositories(basePackages = ["com.baeldung.spring.data.es.repository"])
@ComponentScan(basePackages = ["com.baeldung.spring.data.es.service"])
class SearchProviderConfig {

    @Bean
    fun client(@Value("\${elasticsearch.url}") url: String): RestHighLevelClient? {
        val clientConfiguration: ClientConfiguration = ClientConfiguration.builder()
            .connectedTo(url)
            .build()
        return RestClients.create(clientConfiguration).rest()
    }

    @Bean
    @Autowired
    fun elasticsearchTemplate(client: RestHighLevelClient): ElasticsearchOperations? {
        return ElasticsearchRestTemplate(client)
    }

}