import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios';
import { formatDate } from '../utils/formatDate';
import { useWalletStore } from '../stores/useWalletStore';

const fetchPositionHistoryTable = async (walletId) => {
  if (!walletId) {
    throw new Error('Wallet ID is undefined');
  }
  const response = await axiosInstance.get(`/api/user-positions/${walletId}`);
  return response.data;
};

const formatPositionHistoryTable = (data) => {
  return data.map((position) => ({
    ...position,
    amount: Number(position.amount).toFixed(2),
    start_price: `$${position.start_price.toFixed(2)}`,
    multiplier: position.multiplier.toFixed(1),
    created_at: formatDate(position.created_at),
    closed_at: position.closed_at ? formatDate(position.closed_at) : '-',
    datetime_liquidation: formatDate(position.datetime_liquidation),
    status: position.status.charAt(0).toUpperCase() + position.status.slice(1),
    is_liquidated: position.is_liquidated ? 'Yes' : 'No',
  }));
};

const usePositionHistoryTable = () => {
  const walletId = useWalletStore((state) => state.walletId);

  const { data, isPending, error } = useQuery({
    queryKey: ['positionHistory', walletId],
    queryFn: () => fetchPositionHistoryTable(walletId),
    enabled: !!walletId,
    onError: (err) => {
      console.error('Error during fetching position history:', err);
    },
    select: formatPositionHistoryTable,
  });

  const showSpinner = !!walletId && isPending;

  return {
    data,
    isPending: showSpinner,
    error: walletId ? error : 'Wallet ID is required',
  };
};

export { usePositionHistoryTable };
