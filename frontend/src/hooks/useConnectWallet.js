import { useMutation } from '@tanstack/react-query';
import { notify } from '../components/layout/notifier/Notifier';
import { useWalletConnection, useCRMToken } from '../services/wallet';

export const useConnectWallet = (setWalletId) => {
  const {connectWallet} = useWalletConnection()
  const walletAddress = connectWallet();
  const hasCRMToken = useCRMToken();
  return useMutation({
    mutationFn: async () => {

      if (!walletAddress) {
        throw new Error('Failed to connect wallet');
      }
      
      if (!hasCRMToken) {
        throw new Error('Wallet does not have CRM token');
      }

      return walletAddress;
    },
    onSuccess: (walletAddress) => {
      setWalletId(walletAddress);
      notify('Wallet connected')
    },
    onError: (error) => {
      console.error('Wallet connection failed:', error);
      notify('Failed to connect wallet. Please try again.', 'error');
    },
  });
};
