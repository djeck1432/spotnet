import { getWallet } from './wallet';
import { getDeployContractData } from '../utils/constants';
import { axiosInstance } from '../utils/axios';
import { notify, ToastWithLink } from '../components/layout/notifier/Notifier';

export async function deployContract(walletId) {
  try {
    // Connect to Starknet wallet
    const wallet = await getWallet();

    // Prepare the deploy contract transaction object
    const deployContractTransaction = getDeployContractData(walletId);

    // Execute the deployment transaction
    // const result = await wallet.account.execute([deployContractTransaction]);
    const result = await wallet.account.deployContract(deployContractTransaction);
    console.log('Contract deployed successfully:', result);
    await wallet.account.waitForTransaction(result.transaction_hash);
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

      notify(
        ToastWithLink(
          'Contract Deployed Successfully',
          `https://starkscan.co/tx/${result.transactionHash}`,
          'Transaction ID'
        ),
        'success'
      );
      console.log('Contract address:', contractAddress);

      // Update the backend with transaction hash and wallet ID
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
  }
}
