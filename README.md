# External Search Provider

This repository contains the External Search Provider.
It connects Elasticsearch to the rest of the SCD registry. 
This repository contains submodules.
Thus, users should clone this repository by running:

```bash
git clone --recurse-submodules -j8 https://github.com/TIHBS/scd-registry-external-search-provider.git
```

Or after cloning, it users should run:

```bash
git submodule update --init --recursive
```

## Requirements

- npm
- node
- docker
- docker-compose

## Build

To build the project:

```bash
npm i
npm run build
```

## Start

Before starting set the following environment variables:
```bash
SWARM_API=<url-to-swarm-api>
ELASTICSEARCH_URL=<url-to-elasticsearch>
NETWORKISH=<networkish-of-registry-contract>
REGISTRY_ADDRESS=<address-of-the-registry-contract>
```

To start the External Search Provider run:

```bash
npm start
```

To start it with docker and Elasticsearch run:

```bash
docker-compose up
```

## Test

To test the project run:

```bash
npm test
```
