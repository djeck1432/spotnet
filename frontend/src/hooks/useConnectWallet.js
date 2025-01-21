import { useMutation } from '@tanstack/react-query';
import { notify } from '../components/layout/notifier/Notifier';
import { useConnectWallet1, useCRMToken } from '../services/wallet';

export const useConnectWallet = (setWalletId) => {
  const connectWallet = useConnectWallet1();
  const checkForCRMToken = useCRMToken();
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
      notify('Failed to connect wallet. Please try again.', 'error');
    },
  });
};
