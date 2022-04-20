import { ethereumConnector } from "./EthereumConnector";
import { ethers, providers } from "ethers";

async function main() {
  const url = process.env.GANACHE_URL
    ? process.env.GANACHE_URL
    : "http://localhost:8545";
  console.log(url);
  const provider = await ethers.providers.getDefaultProvider(url);
  ethereumConnector.setSigner(provider);
  ethereumConnector.subscribe();
}

main().then().catch();
