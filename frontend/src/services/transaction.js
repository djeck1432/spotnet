import { connect } from 'starknetkit';
import { CallData } from 'starknet';
import { erc20abi } from '../abis/erc20';
import { abi } from '../abis/abi';
import { axiosInstance } from '../utils/axios';
import {checkAndDeployContract} from './contract';
import { notify, ToastWithLink } from '../components/layout/notifier/Notifier';


export async function sendTransaction(loopLiquidityData, contractAddress) {
  try {
    const starknet = await connect({
      include: ['argentX', 'braavos'],
      modalMode: "canAsk",
      modalTheme: "light"
    });

    if (!starknet.isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!loopLiquidityData.pool_key || !loopLiquidityData.deposit_data) {
      throw new Error('Missing or invalid loop_liquidity_data fields');
    }
    console.log(loopLiquidityData);

    // Use CallData for approve transaction
    let approveCalldata = new CallData(erc20abi);
    const approveTransaction = {
      contractAddress: loopLiquidityData.deposit_data.token,
      entrypoint: 'approve',
      calldata: approveCalldata.compile('approve', [contractAddress, loopLiquidityData.deposit_data.amount]),
    };

    console.log(loopLiquidityData);

    // Use CallData for loop_liquidity transaction
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
    notify(ToastWithLink("Transaction successfully sent", `https://starkscan.co/tx/${result.transaction_hash}`, "Transaction ID"), "success");
    
    return {
      loopTransaction: result.transaction_hash,
    };
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

export async function waitForTransaction(txHash) {
  const starknet = await connect({
    include: ['argentX', 'braavos'],
    modalMode: "canAsk",
    modalTheme: "light"
  });
  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await starknet.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.log('Waiting for transaction to be accepted...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  console.log('Transaction accepted:', receipt);
}

export async function closePosition(transactionData) {
  const callData = new CallData(abi);
  const compiled = callData.compile('close_position', transactionData);

  const starknet = await connect({
    include: ['argentX', 'braavos'],
    modalMode: "canAsk",
    modalTheme: "light"
  });
  console.log(transactionData.contract_address);
  let result = await starknet.account.execute([
    {
      contractAddress: transactionData.contract_address,
      entrypoint: 'close_position',
      calldata: compiled
    },
  ]);
  notify(ToastWithLink("Close position successfully sent", `https://starkscan.co/tx/${result.transaction_hash}`, "Transaction ID"), "success");
}

export const handleTransaction = async (
  connectedWalletId,
  formData,
  setError,
  setTokenAmount,
  setLoading,
  setSuccessful
) => {
  setLoading(true);
  setError('');
  try {
    await checkAndDeployContract(connectedWalletId);
  } catch (error) {
    console.error('Error deploying contract:', error);
    setError('Error deploying contract. Please try again.');
    setSuccessful(false);
    setLoading(false);
    return;
  }

  try {
    const response = await axiosInstance.post(`/api/create-position`, formData);
    const transactionData = response.data;
    await sendTransaction(transactionData, transactionData.contract_address);
    console.log('Transaction executed successfully');

    const openPositionResponse = await axiosInstance.get(`/api/open-position`, {
      params: { position_id: transactionData.position_id },
    });

    openPositionResponse == openPositionResponse;
    setTokenAmount('');
  } catch (err) {
    console.error('Failed to create position:', err);
    setError('Failed to create position. Please try again.');
    setSuccessful(false);
  } finally {
    setLoading(false);
  }
};