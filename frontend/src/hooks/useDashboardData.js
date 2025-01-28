import { useQuery } from '@tanstack/react-query';
import QueryKeys from '../QueryKeys/QueryKeys';
import { axiosInstance } from '../utils/axios';
import { useWalletStore } from '../stores/useWalletStore';

export const fetchDashboardData = async (walletId) => {
  if (!walletId) {
    throw new Error('Wallet ID is undefined');
  }
  const response = await axiosInstance.get(`/api/dashboard?wallet_id=${walletId}`);
  return response.data;
};

const useDashboardData = () => {
  const walletId = useWalletStore((state) => state.walletId);
  return useQuery({
    queryKey: [QueryKeys.DashboardData, walletId],
    queryFn: () => fetchDashboardData(walletId),
    enabled: !!walletId,
    onError: (error) => {
      console.error('Error during getting the data from API', error);
    },
  });
};

export default useDashboardData;
