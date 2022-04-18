package com.scdregistry.searchprovider.entities

import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field

@Document(indexName = "scd")
data class SCD(
    @Id
    val id: Long,

    @Field
    var name: String,

    @Field
    var author: String,
)