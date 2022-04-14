package com.example.kotlin.entities

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "smart_contract")
data class SmartContract(
    @Id val name: String,
    @Column(nullable = false) var address: String
)