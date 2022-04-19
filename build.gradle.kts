import com.github.gradle.node.npm.task.NpmTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "2.6.3"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("org.web3j") version "4.9.0"
    id("org.jetbrains.kotlin.plugin.jpa") version "1.6.10"
    id("com.google.cloud.tools.jib") version "3.1.4"
    id("com.github.node-gradle.node") version "3.2.1"
    kotlin("jvm") version "1.6.10"
    kotlin("plugin.spring") version "1.6.10"
}

group = "com.scdregistry"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

jib {
    to { image = "external-search-provider" }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.web3j:core:5.0.0")
    implementation("org.web3j:solidity-gradle-plugin:0.1.6")
    implementation("org.springframework.boot:spring-boot-starter-web:2.6.6")
    implementation("org.jetbrains.kotlin:kotlin-reflect:1.6.20")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.6.20")
    implementation("org.springframework.data:spring-data-elasticsearch:4.3.3")
    implementation("io.github.microutils:kotlin-logging-jvm:2.1.21")
    implementation("ch.qos.logback:logback-classic:1.2.11")
    testImplementation("org.springframework.boot:spring-boot-starter-test:2.6.6")
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.8.2")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.8.2")
}

node {
    // nodeProjectDir.set(file("${project.projectDir}/external/decentralised-scd-registry"))
    version.set("16.13.2")
}

solidity {
    resolvePackages = true
    pathRemappings =
        mapOf("@openzeppelin/contracts/utils/structs/EnumerableSet.sol" to "build/node_modules/@openzeppelin/contracts/utils/structs/EnumerableSet.sol")
}

tasks.register<NpmTask>("npmInstallDecentralisedScdRegistry") {
    execOverrides {
        workingDir = file("${project.projectDir}/external/decentralised-scd-registry")
        args("install")
    }
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "11"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
