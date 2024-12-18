import { connect } from 'starknetkit';
import { getDeployContractData } from '../utils/constants';
import { axiosInstance } from '../utils/axios';

export async function deployContract(walletId) {
  try {
    console.log('Connecting to StarkNet wallet...');
    
    const starknet = await connect();

    
    if (!starknet || !starknet.isConnected) {
      throw new Error('Wallet not connected');
    }

    console.log('Wallet connected:');


    const deployContractTransaction = getDeployContractData(walletId);
    if (!deployContractTransaction) {
      throw new Error('Failed to retrieve contract deployment data');
    }

    console.log('Deploying contract...');
    const result = await starknet.account.deployContract(deployContractTransaction);
    console.log('Contract deployed successfully:', result);

    
    await starknet.account.waitForTransaction(result.transaction_hash);
    console.log('Transaction confirmed:', result.transaction_hash);

    return {
      transactionHash: result.transaction_hash,
      contractAddress: result.contract_address,
    };
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
}

export async function checkAndDeployContract(walletId) {
  try {
    console.log('Checking if contract is deployed for wallet ID:', walletId);

    
    const response = await axiosInstance.get(`/api/check-user?wallet_id=${walletId}`);
    console.log('Backend response:', response.data);

    
    if (!response.data.is_contract_deployed) {
      console.log('Contract not deployed. Deploying...');
      const result = await deployContract(walletId);
      const contractAddress = result.contractAddress;

      console.log('Contract address:', contractAddress);

      
      await axiosInstance.post(`/api/update-user-contract`, {
        wallet_id: walletId,
        contract_address: contractAddress,
      });
      console.log('Backend updated with deployment information.');
    } else {
      console.log('Contract is already deployed for wallet ID:', walletId);
    }
  } catch (error) {
    console.error('Error checking contract status:', error);
    throw error;
  }
}
