import { connect } from 'get-starknet';
import { CallData } from 'starknet';
import { erc20abi } from '../abis/erc20';
import { abi } from '../abis/abi';
import { axiosInstance } from '../utils/axios';

export async function sendTransaction(loopLiquidityData, contractAddress) {
  try {
    const starknet = await connect();
    if (!starknet.isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!loopLiquidityData.pool_key || !loopLiquidityData.deposit_data) {
      throw new Error('Missing or invalid loop_liquidity_data fields');
    }
    console.log(loopLiquidityData);
    let approveCalldata = new CallData(erc20abi);
    const approveTransaction = {
      contractAddress: loopLiquidityData.deposit_data.token,
      entrypoint: 'approve',
      calldata: approveCalldata.compile('approve', [contractAddress, loopLiquidityData.deposit_data.amount]),
    };

    const callData = new CallData(abi);
    const compiled = callData.compile('loop_liquidity', loopLiquidityData);
    const depositTransaction = {
      contractAddress: contractAddress,
      entrypoint: 'loop_liquidity',
      calldata: compiled,
    };
    let result = await starknet.account.execute([approveTransaction, depositTransaction]);
    console.log('Resp: ');
    console.log(result);
    return {
      loopTransaction: result.transaction_hash,
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}
/* eslint-disable-next-line no-unused-vars */
async function waitForTransaction(txHash) {
  const starknet = await connect();
  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await starknet.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.log('Waiting for transaction to be accepted...');
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before trying again
    }
  }
  console.log('Transaction accepted:', receipt);
}

export async function closePosition(transactionData) {
  const callData = new CallData(abi);
  const compiled = callData.compile('close_position', transactionData);
  console.log(compiled);
  const starknet = await connect();
  console.log(transactionData.contract_address);
  await starknet.account.execute([
    { contractAddress: transactionData.contract_address, entrypoint: 'close_position', calldata: compiled },
  ]);
}

export const handleTransaction = async (connectedWalletId, formData, setError, setTokenAmount, setLoading) => {

  setLoading(true);
  setError('');

  try {
    const response = await axiosInstance.post(`/api/create-position`, formData);

    const transactionData = response.data;
    await sendTransaction(transactionData, transactionData.contract_address);
    console.log('Transaction executed successfully');

    // Reset form data
    setTokenAmount('');
  } catch (err) {
    console.error('Failed to create position:', err);
    setError('Failed to create position. Please try again.');
  } finally {
    setLoading(false);
  }
};
