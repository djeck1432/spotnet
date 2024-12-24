import { connect } from 'get-starknet';
import { CallData } from 'starknet';
import { erc20abi } from '../abis/erc20';
import { abi } from '../abis/abi';
import { axiosInstance } from '../utils/axios';
import { checkAndDeployContract } from './contract';
import { notify, ToastWithLink } from '../components/layout/notifier/Notifier';

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
    console.log(loopLiquidityData);
    const callData = new CallData(abi);
    const compiled = callData.compile('loop_liquidity', loopLiquidityData);
    const depositTransaction = {
      contractAddress: contractAddress,
      entrypoint: 'loop_liquidity',
      calldata: compiled,
    };
    console.log(depositTransaction);
    let result = await starknet.account.execute([approveTransaction, depositTransaction]);

    console.log('Resp: ');
    console.log(result);
    notify(
      ToastWithLink(
        'Transaction successfully sent',
        `https://starkscan.co/tx/${result.transaction_hash}`,
        'Transaction ID'
      ),
      'success'
    );

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
  let result = await starknet.account.execute([
    { contractAddress: transactionData.contract_address, entrypoint: 'close_position', calldata: compiled },
  ]);
  notify(
    ToastWithLink(
      'Close position successfully sent',
      `https://starkscan.co/tx/${result.transaction_hash}`,
      'Transaction ID'
    ),
    'success'
  );
}

export const handleTransaction = async (connectedWalletId, formData, setTokenAmount, setLoading) => {
  setLoading(true);
  try {
    await checkAndDeployContract(connectedWalletId);
  } catch (error) {
    console.error('Error deploying contract:', error);
    notify('Error deploying contract. Please try again.', 'error');
    setLoading(false);
    return;
  }
  try {
    const response = await axiosInstance.post(`/api/create-position`, formData);

    const transactionData = response.data;
    const { loopTransaction: transaction_hash } = await sendTransaction(transactionData, transactionData.contract_address);
    console.log('Transaction executed successfully');

    const openPositionResponse = await axiosInstance.get(`/api/open-position`, {
      params: { position_id: transactionData.position_id, transaction_hash },
    });

    openPositionResponse == openPositionResponse;

    setTokenAmount('');
  } catch (err) {
    console.error('Failed to create position:', err);
    notify(`Error sending transaction: ${err}`, 'error');
  } finally {
    setLoading(false);
  }
};
