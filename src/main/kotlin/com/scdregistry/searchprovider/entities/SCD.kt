package com.scdregistry.searchprovider.entities

import org.springframework.data.annotation.Id
import org.springframework.data.elasticsearch.annotations.Document
import org.springframework.data.elasticsearch.annotations.Field
import org.springframework.data.elasticsearch.annotations.FieldType

@Document(indexName = "scd")
data class SCD(
    @Id
    val id: Long,

    @Field(type = FieldType.Text, name = "name")
    var name: String,

    @Field(type = FieldType.Text, name = "author")
    var author: String,
)