import { useQuery } from '@tanstack/react-query';
import QueryKeys from '../QueryKeys/QueryKeys';
import { axiosInstance } from '../utils/axios';
import { useWalletStore } from '../stores/useWalletStore';
import EthIcon from '@/assets/icons/ethereum.svg?react';
import StrkIcon from '@/assets/icons/strk.svg?react';
import kStrkIcon from '@/assets/icons/kstrk.svg?react';
import UsdIcon from '@/assets/icons/usd_coin.svg?react';
import CollateralIcon from '@/assets/icons/collateral_dynamic.svg?react';
import BorrowIcon from '@/assets/icons/borrow_dynamic.svg?react';

export const fetchDashboardData = async (walletId) => {
  if (!walletId) throw new Error('Wallet ID is undefined');
  const { data } = await axiosInstance.get(`/api/dashboard?wallet_id=${walletId}`);
  return data;
};

const useDashboardData = () => {
  const walletId = useWalletStore((state) => state.walletId);

  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.DashboardData, walletId],
    queryFn: () => fetchDashboardData(walletId),
    enabled: !!walletId,
    select: ({
      health_ratio = '0.00',
      current_sum = 0,
      start_sum = 0,
      borrowed = 0,
      multipliers = {},
      balance = 0,
      deposit_data = [],
      position_id = null,
    }) => {
      const depositedData = deposit_data.reduce(
        (acc, { token, amount }) => ({
          ...acc,
          [token.toLowerCase()]: (acc[token.toLowerCase()] || 0) + Number(amount),
        }),
        { eth: 0, strk: 0, usdc: 0, usdt: 0, kstrk: 0 }
      );

      const currencyMap = {
        STRK: { name: 'STRK', icon: StrkIcon },
        kSTRK: { name: 'kSTRK', icon: kStrkIcon },
        ETH: { name: 'Ethereum', icon: EthIcon },
        USDC: { name: 'USDC', icon: UsdIcon },
      };

      const { name: currencyName, icon: currencyIcon } =
        currencyMap[Object.entries(multipliers).find(([key]) => currencyMap[key])?.[0]] || currencyMap.ETH;

      const cardData = [
        {
          title: 'Collateral & Earnings',
          icon: CollateralIcon,
          balance,
          currencyName,
          currencyIcon,
        },
        {
          title: 'Borrow',
          icon: BorrowIcon,
          balance: borrowed,
          currencyName: 'USD Coin',
          currencyIcon: UsdIcon,
        },
      ];

      return {
        cardData,
        healthFactor: health_ratio,
        startSum: start_sum,
        currentSum: current_sum,
        depositedData,
        position_id,
      };
    },
    onError: (error) => console.error('Error fetching dashboard data:', error),
  });

  return {
    data: {
      health_ratio: data?.healthFactor || '0.00',
      borrowed: data?.cardData.find((card) => card.title === 'Borrow')?.balance || 0,
      position_id: data?.position_id || null,
    },
    cardData: data?.cardData || [],
    healthFactor: data?.healthFactor || '0.00',
    startSum: data?.startSum || 0,
    currentSum: data?.currentSum || 0,
    depositedData: data?.depositedData || { eth: 0, strk: 0, usdc: 0, usdt: 0, kstrk: 0 },
    isLoading,
    error,
  };
};

export default useDashboardData;
