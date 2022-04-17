package com.scdregistry.searchprovider.entities

import org.hibernate.search.annotations.Field
import org.hibernate.search.annotations.Indexed

import javax.persistence.Entity
import javax.persistence.Id

@Entity
@Indexed(index = "scd")
data class SCD(
    @Id
    val id: Long,

    @Field
    var name: String,

    @Field
    var author: String,
)