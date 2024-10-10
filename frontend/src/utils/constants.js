export const CONTRACT_ADDRESS = "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf";
export const CLASS_HASH = "0x01c9cff3858f5753d18bf19715a5a163c74453594ce4e9b421478161f4f70eee";
export const UNIQUE = "0x0";
export const EKUBO_ADDRESS =  "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b"
export const ZKLEND_ADDRESS = "0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05"


export function getDeployContractData(walletId) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        classHash: CLASS_HASH,
        salt: `0x${Math.floor(Math.random() * 1e16).toString(16)}`, // Generate random salt
        unique: UNIQUE,
        calldata: [
            EKUBO_ADDRESS,
            ZKLEND_ADDRESS,
            walletId
        ]
    };
}
