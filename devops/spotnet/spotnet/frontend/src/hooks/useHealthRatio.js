import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios';

const TOKEN_CONFIG = {
  ETH: {
    id: 'ethereum',
    collateralFactor: 0.8,
    borrowFactor: 0.9,
    decimals: 18,
  },
  USDC: {
    id: 'usd-coin',
    collateralFactor: 0.85,
    borrowFactor: 0.9,
    decimals: 6,
  },
  STRK: {
    id: 'starknet',
    collateralFactor: 0.75,
    borrowFactor: 0.85,
    decimals: 18,
  },
};

const fetchTokenPrice = async (tokenId) => {
  const { data } = await axiosInstance.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
  );
  return data[tokenId].usd;
};

export const useHealthFactor = (selectedToken, tokenAmount, selectedMultiplier) => {
  const tokenId = selectedToken ? TOKEN_CONFIG[selectedToken]?.id : null;

  const { data: tokenPrice = 0, error } = useQuery({
    queryKey: ['tokenPrice', tokenId],
    queryFn: () => fetchTokenPrice(tokenId),
    enabled: !!tokenId,
    staleTime: 30000,
    cacheTime: 60000,
  });

  const calculateHealthFactor = () => {
    if (!tokenAmount || !selectedMultiplier || !tokenPrice) {
      return 0;
    }

    try {
      const amount = parseFloat(tokenAmount);
      const multiplier = parseFloat(selectedMultiplier);
      const tokenConfig = TOKEN_CONFIG[selectedToken];

      const collateralValue = amount * tokenPrice * tokenConfig.collateralFactor;
      const borrowedAmount = amount * tokenPrice * (multiplier - 1);
      const adjustedDebtValue = borrowedAmount / tokenConfig.borrowFactor;
      const healthFactorValue = collateralValue / adjustedDebtValue;

      return Number(healthFactorValue.toFixed(6));
    } catch (error) {
      console.error('Error calculating health factor:', error);
      return 0;
    }
  };

  return {
    healthFactor: calculateHealthFactor(),
    tokenPrice,
    isLoading: !error && !tokenPrice,
    isError: !!error,
  };
};
