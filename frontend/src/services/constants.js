import {CallData} from "starknet";
import {abi} from "../abis/abi";

export const CONTRACT_ADDRESS = "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf";
export const CLASS_HASH = "0x07898133aa022d3bc986f9397606990a5f64628e8e6a0aaa23cb91fb7b325d9e";
export const UNIQUE = "0x0";
export const EKUBO_ADDRESS =  "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b"
export const ZKLEND_ADDRESS = "0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05"
export const ZETH_ADDRESS = "0x01b5bd713e72fdc5d63ffd83762f81297f6175a5e0a4771cdadbc1dd5fe72cb1"


export const ETH_ADDRESS = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
export const STRK_ADDRESS = "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
export const USDC_ADDRESS = "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"

export function getDeployContractData(walletId) {
    return {
        classHash: CLASS_HASH,
        salt: `0x${Math.floor(Math.random() * 1e16).toString(16)}`, // Generate random salt
        unique: false,
        constructorCalldata: [
            walletId,
            EKUBO_ADDRESS,
            ZKLEND_ADDRESS
        ]
    };
}
