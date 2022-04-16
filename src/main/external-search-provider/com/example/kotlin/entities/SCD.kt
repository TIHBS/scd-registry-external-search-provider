package com.example.kotlin.entities

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class SCD(
    @Id
    val id: Long,
    
    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var author: String,
)