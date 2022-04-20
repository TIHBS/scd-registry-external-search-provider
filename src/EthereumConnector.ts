import { BigNumberish, Signer } from "ethers";
import {
  ContractRegisteredEventFilter,
  Registry,
  RegistryInterface,
} from "../external/decentralised-scd-registry/src/types/Registry";
import { Registry__factory } from "../external/decentralised-scd-registry/src/types/factories/Registry__factory";
import { Provider } from "@ethersproject/abstract-provider";

class EthereumConnector {
  private signer: Signer | Provider | undefined;
  private static contractAddress = "0x222E34DA1926A9041ed5A87f71580D4D27f84fD3";

  public setSigner(signer: Signer | Provider | undefined) {
    this.signer = signer;
  }

  public subscribe() {
    const contract = this.createRegistryContract();
    const filter = contract.filters.ContractRegistered();
    console.log(filter);
    contract.on(filter, (id) => {
      console.log(`Received: ${id}`);
    });
  }

  private createRegistryContract(): Registry {
    if (this.signer) {
      return Registry__factory.connect(
        EthereumConnector.contractAddress,
        this.signer
      );
    }
    throw new Error("You are not logged in!");
  }

  async query(
    query: string
  ): Promise<Registry.SCDMetadataWithIDStructOutput[]> {
    return this.createRegistryContract().query(query);
  }
}

const ethereumConnector = new EthereumConnector();
export { ethereumConnector };
