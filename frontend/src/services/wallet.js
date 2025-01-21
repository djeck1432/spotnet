import React from 'react';
import { disconnect } from 'starknetkit';
import { useStarknetkitConnectModal } from 'starknetkit';
import { useConnect, useAccount } from '@starknet-react/core';
import { ETH_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from '../utils/constants';
import { ReactComponent as ETH } from 'assets/icons/ethereum.svg';
import { ReactComponent as USDC } from 'assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from 'assets/icons/strk.svg';
import { useAccountStore } from '../stores/useWalletStore';

const CRM_TOKEN_ADDRESS = "0x051c4b1fe3bf6774b87ad0b15ef5d1472759076e42944fff9b9f641ff13e5bbe";
let globalWallet = null;

// Check if the connected wallet holds the CRM token
export const useCRMToken = () => {
  const {account} = useAccount();

 const checkForCRMToken = async (walletAddress) => {
  if (process.env.REACT_APP_IS_DEV === "true") {
    console.log("Development mode: Skipping CRM token check.");
    return true;
  }

  try {
  
    console.log('Checking CRM token balance for wallet:', walletAddress);
    const response = await account.callContract({
      contractAddress: CRM_TOKEN_ADDRESS,
      entrypoint: 'balanceOf',
      calldata: [walletAddress],
    });
    const balance = BigInt(response[0]).toString();
    console.log('balance', balance)

    if (Number(balance) > 0) {
      return true;
    } else {
      alert("Beta testing is allowed only for users who hold the CRM token.");
      return false;
    }
  } catch (error) {
    console.error("Error checking CRM token balance:", error);
    throw error;
  }
};

  return checkForCRMToken;
}


export const useWalletConnect = () => {
  const { connect: starknetConnect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({ connectors });
  const { account } = useAccount();
  const setAccount = useAccountStore((state) => state.setAccount);

  const connectWallet = async () => {
    try {
      console.log('Attempting to connect to wallet...');
      
      const { connector } = await starknetkitConnectModal();
      if (!connector) {
        console.error('No connector selected');
        return null;
      }

      starknetConnect({ connector });
      // await new Promise(resolve => setTimeout(resolve, 5000));

      console.log('account', account);
      setAccount(account);
      globalWallet = account;
      return account.address
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
      throw error;
    }
  };

  return connectWallet;
};

export const getWallet = async () => {
  if (globalWallet && globalWallet.isConnected) {
    return globalWallet;
  }

  console.log('No wallet found. Attempting to connect...');
  return ;
};

export function logout() {
  localStorage.removeItem('wallet_id');
  localStorage.removeItem('account');
  disconnect();
}

export const useTokenBalances = () => {

  const account = useAccountStore((state) => state.account);
const getTokenBalances = async (walletAddress) => {
  try {
    console.log("Wallet info", account);
    if (!walletAddress || !account) return;

    const tokenBalances = {
      ETH: await getTokenBalance(account, walletAddress, ETH_ADDRESS),
      USDC: await getTokenBalance(account, walletAddress, USDC_ADDRESS),
      STRK: await getTokenBalance(account, walletAddress, STRK_ADDRESS),
    };

    return tokenBalances;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
}
return { getTokenBalances };
}

export async function getTokenBalance(wallet, walletAddress, tokenAddress) {
  try {
    const response = await wallet.callContract({
      contractAddress: tokenAddress,
      entrypoint: 'balanceOf',
      calldata: [walletAddress],
    });

    const tokenDecimals = (tokenAddress === USDC_ADDRESS) ? 6 : 18;
    const balance = BigInt(response[0]).toString();
    const readableBalance = (Number(balance) / (10 ** tokenDecimals)).toFixed(4);
    console.log(`Balance for token ${tokenAddress}:`, readableBalance);
    return readableBalance;
  } catch (error) {
    console.error(`Error fetching balance for token ${tokenAddress}:`, error);
    return '0';
  }
}

export const useGetBalance = () => {
 const {getTokenBalances} = useTokenBalances();

const getBalances = async (walletId, setBalances) => {
  if (!walletId) return;
  try {
    const data = await getTokenBalances(walletId);

    const updatedBalances = [
      {
        icon: <ETH />,
        title: 'ETH',
        balance: data.ETH !== undefined ? data.ETH.toString() : '0.00',
      },
      {
        icon: <USDC />,
        title: 'USDC',
        balance: data.USDC !== undefined ? data.USDC.toString() : '0.00',
      },
      {
        icon: <STRK />,
        title: 'STRK',
        balance: data.STRK !== undefined ? data.STRK.toString() : '0.00',
      },
    ];

    setBalances(updatedBalances);
  } catch (error) {
    console.error('Error fetching user balances:', error);
  }
};

return { getBalances };
}

// Add this line for environments that don't recognize BigInt
const BigInt = window.BigInt;