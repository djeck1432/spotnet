import React from 'react';
import { useConnect, useAccount, useBalance } from '@starknet-react/core';
import { ETH_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from '../utils/constants';
import { ReactComponent as ETH } from 'assets/icons/ethereum.svg';
import { ReactComponent as USDC } from 'assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from 'assets/icons/strk.svg';

const CRM_TOKEN_ADDRESS = "0x051c4b1fe3bf6774b87ad0b15ef5d1472759076e42944fff9b9f641ff13e5bbe";

export const useCRMToken = () => {
  const { address, isConnected } = useAccount();

  const { data: balance, isLoading, error } = useBalance({
    token: CRM_TOKEN_ADDRESS,
    address: address,
    watch: true,
  });

  // Dev mode check
  if (process.env.REACT_APP_IS_DEV === "true") {
    console.log("Development mode: Skipping CRM token check.");
    return {
      hasCRMToken: true,
      isLoading: false,
      error: null
    };
  }

  console.log('Checking CRM token balance for wallet:', address);

  if (isLoading) {
    return {
      hasCRMToken: false,
      isLoading: true,
      error: null
    };
  }

  if (error) {
    console.error("Error checking CRM token balance:", error);
    throw error;
  }

  const realBalance = balance?.formatted 
    ? balance.formatted.slice(0, 4) 
    : '0.0000';

  const hasCRM = Number(realBalance) > 0;
  
  if (!hasCRM && isConnected) {
    alert("Beta testing is allowed only for users who hold the CRM token.");
  }

  return {
    hasCRMToken: hasCRM,
    isLoading: false,
    error: null
  };
};


export const useWalletConnection = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnected, account } = useAccount();

  const connectWallet = async (connector) => {
    try {
      if (connector) {
        connect({ connector });
      }
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  return {
    address,
    isConnected,
    connectWallet,
    connectors,
    account
  };
};

export const useTokenBalance = (tokenAddress) => {
  const { address, isConnected } = useWalletConnection();

  const { data: balance, isLoading } = useBalance({
    token: tokenAddress,
    address: address,
    watch: true
  });

  if (!isConnected) {
    return { balance: '0.0000', isLoading: false };
  }

  const formattedBalance = balance?.formatted 
    ? balance.formatted.slice(0, 4) 
    : '0.0000';

  return {
    balance: formattedBalance,
    isLoading,
    symbol: balance?.symbol
  };
};

export const useAllTokenBalances = () => {
  const ethBalance = useTokenBalance(ETH_ADDRESS);
  const usdcBalance = useTokenBalance(USDC_ADDRESS);
  const strkBalance = useTokenBalance(STRK_ADDRESS);

  return [
    {
      icon: <ETH />,
      title: 'ETH',
      balance: ethBalance.balance,
      isLoading: ethBalance.isLoading,
    },
    {
      icon: <USDC />,
      title: 'USDC',
      balance: usdcBalance.balance,
      isLoading: usdcBalance.isLoading,
    },
    {
      icon: <STRK />,
      title: 'STRK',
      balance: strkBalance.balance,
      isLoading: strkBalance.isLoading,
    },
  ];
};
