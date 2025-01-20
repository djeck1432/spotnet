import { CallData } from 'starknet';
import { erc20abi } from '../abis/erc20';
import { abi } from '../abis/abi';
import { axiosInstance } from '../utils/axios';
import { useContractDeployment } from './contract';
import { notify, ToastWithLink } from '../components/layout/notifier/Notifier';
import { useState } from 'react';
import { useWalletConnection } from './wallet';

export async function sendTransaction(account, loopLiquidityData, contractAddress) {
  try {
    if (!loopLiquidityData.pool_key || !loopLiquidityData.deposit_data) {
      throw new Error('Missing or invalid loop_liquidity_data fields');
    }

    let approveCalldata = new CallData(erc20abi);
    const approveTransaction = {
      contractAddress: loopLiquidityData.deposit_data.token,
      entrypoint: 'approve',
      calldata: approveCalldata.compile('approve', [contractAddress, loopLiquidityData.deposit_data.amount]),
    };

    let callData = new CallData(abi);
    const compiled = callData.compile('loop_liquidity', loopLiquidityData);
    const depositTransaction = {
      contractAddress,
      entrypoint: 'loop_liquidity',
      calldata: compiled,
    };

    const result = await account.execute([approveTransaction, depositTransaction]);

    notify(
      ToastWithLink(
        'Transaction successfully sent',
        `https://starkscan.co/tx/${result.transaction_hash}`,
        'Transaction ID'
      ),
      'success'
    );

    return { loopTransaction: result.transaction_hash };
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

export async function sendWithdrawAllTransaction(account, data, userContractAddress) {
  try {
    const contractCalldata = new CallData(abi);
    const closeCalldata = contractCalldata.compile('close_position', data.repay_data);
    const withdrawCalls = data.tokens.map((token) => ({
      contractAddress: userContractAddress,
      entrypoint: 'withdraw',
      calldata: contractCalldata.compile('withdraw', { token, amount: 0 }),
    }));

    const result = await account.execute([
      { contractAddress: userContractAddress, entrypoint: 'close_position', calldata: closeCalldata },
      ...withdrawCalls,
    ]);

    notify(
      ToastWithLink(
        'Withdraw all successfully sent',
        `https://starkscan.co/tx/${result.transaction_hash}`,
        'Transaction ID'
      ),
      'success'
    );

    return { transaction_hash: result.transaction_hash };
  } catch (error) {
    console.error('Error sending withdraw transaction:', error);
    throw error;
  }
}


export async function sendExtraDepositTransaction(account, deposit_data, userContractAddress) {
  try {
    const token_address = deposit_data.token_address;
    const token_amount = deposit_data.token_amount;
    const extraDepositCalldata = new CallData(abi);

    const approveCalldata = new CallData(erc20abi);
    const compiledApproveCalldata = approveCalldata.compile('approve', [userContractAddress, token_amount]);

    const compiledExtraDepositCalldata = extraDepositCalldata.compile('extra_deposit', [token_address, token_amount]);

    const approveTransaction = {
      contractAddress: token_address,
      entrypoint: 'approve',
      calldata: compiledApproveCalldata,
    };

    const extraDepositTransaction = {
      contractAddress: userContractAddress,
      entrypoint: 'extra_deposit',
      calldata: compiledExtraDepositCalldata,
    };

    const result = await account.execute([approveTransaction, extraDepositTransaction]);

    notify(
      ToastWithLink(
        'Extra Deposit Transaction successfully sent',
        `https://starkscan.co/tx/${result.transaction_hash}`,
        'Transaction ID'
      ),
      'success'
    );

    return { transaction_hash: result.transaction_hash };
  } catch (error) {
    console.error('Error sending extra deposit transaction:', error);
    throw error;
  }
}

/* eslint-disable-next-line no-unused-vars */
async function waitForTransaction(provider, txHash) {
  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.log('Waiting for transaction to be accepted...');
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before trying again
    }
  }
  console.log('Transaction accepted:', receipt);
}


export async function closePosition(account, transactionData) {
  try {
    const callData = new CallData(abi);
    const compiled = callData.compile('close_position', transactionData);

    const result = await account.execute([
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

    return result;
  } catch (error) {
    console.error('Error closing position:', error);
    throw error;
  }
}

export function useTransactionHandler() {
  const { account } = useWalletConnection();
  const [isLoading, setIsLoading] = useState(false);
  const { checkAndDeployContract } = useContractDeployment(account);
const handleTransaction = async (account, connectedWalletId, formData, setTokenAmount) => {
  setIsLoading(true);
  try {
    const result = await checkAndDeployContract(connectedWalletId);
console.log('deployment', result)
  } catch (error) {
    console.error('Error deploying contract:', error);
    notify('Error deploying contract. Please try again.', 'error');
    setIsLoading(false);
    return;
  }

  try {
    const response = await axiosInstance.post(`/api/create-position`, formData);

    const transactionData = response.data;
    const { loopTransaction: transaction_hash } = await sendTransaction(account, transactionData, transactionData.contract_address);
    console.log('Transaction executed successfully');

    const openPositionResponse = await axiosInstance.get(`/api/open-position`, {
      params: { position_id: transactionData.position_id, transaction_hash },
    });

      // FIXME: this is a hack to eslint (no-unused-vars)
      openPositionResponse == openPositionResponse;

    setTokenAmount('');
  } catch (error) {
    console.error('Failed to create position:', error);
    notify(`Error sending transaction: ${error}`, 'error');
  } finally {
    setIsLoading(false);
  }
}

return { handleTransaction, isLoading };
}
