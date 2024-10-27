import {connect} from 'get-starknet';
import axios from 'axios';
import {getDeployContractData} from "./constants";


export async function deployContract(walletId) {
    try {
        // Connect to Starknet wallet
        const starknet = await connect();
        if (!starknet.isConnected) {
            throw new Error("Wallet not connected");
        }

        // Prepare the deploy contract transaction object
        const deployContractTransaction = getDeployContractData(walletId)

        // Execute the deployment transaction
        // const result = await starknet.account.execute([deployContractTransaction]);
        const result = await starknet.account.deployContract(deployContractTransaction);
        console.log("Deployment transaction response:", result);
        await starknet.account.waitForTransaction(result.transaction_hash);
        return {
            transactionHash: result.transaction_hash, contractAddress: result.contract_address
        };
    } catch (error) {
        console.error("Error deploying contract:", error);
        throw error;
    }
}

export async function checkAndDeployContract(walletId) {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';
    try {
        console.log("Checking if contract is deployed for wallet ID:", walletId);
        const response = await axios.get(`${backendUrl}/api/check-user?wallet_id=${walletId}`);
        console.log("Backend response:", response.data);

        if (!response.data.is_contract_deployed) {
            console.log("Contract not deployed. Deploying...");
            const result = await deployContract(walletId);
            const transactionHash = result.transactionHash;
            const contractAddress = result.contractAddress;

            console.log("Contract address:", contractAddress);

            // Update the backend with transaction hash and wallet ID
            await axios.post(`${backendUrl}/api/update-user-contract`, {
                wallet_id: walletId,
                contract_address: contractAddress,
            });
            console.log("Backend updated with deployment information.");
        } else {
            console.log("Contract is already deployed for wallet ID:", walletId);
        }
    } catch (error) {
        console.error("Error checking contract status:", error);
    }
}

