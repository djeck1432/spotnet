import { useMutation } from '@tanstack/react-query';
import { connectWallet, checkForCRMToken } from 'services/wallet';
import {  notifyError } from 'utils/notification';

export const useConnectWallet = (setWalletId) => {
  return useMutation({
    mutationFn: async () => {
     const walletAddress = await connectWallet();

      if (!walletAddress) {
        throw new Error('Failed to connect wallet');
      }
    const hasCRMToken = await checkForCRMToken(walletAddress);
      if (!hasCRMToken) {
        throw new Error('Wallet does not have CRM token');
      }

      return walletAddress;
    },
    onSuccess: (walletAddress) => {
      setWalletId(walletAddress);
    },
    onError: (error) => {
      console.error('Wallet connection failed:', error);
      notifyError('Failed to connect wallet. Please try again.');
    },
  });
};