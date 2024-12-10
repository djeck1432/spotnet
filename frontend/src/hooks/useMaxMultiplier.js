import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ONE_HOUR_IN_MILLISECONDS } from '../utils/constants';

const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://0.0.0.0:8000';

export const useMaxMultiplier = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['max-multiplier'],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/api/get-multipliers`);
      return response.data.multipliers;
    },
    staleTime: ONE_HOUR_IN_MILLISECONDS,
    refetchInterval: ONE_HOUR_IN_MILLISECONDS,
  });

  return { data, isLoading: isPending, error };
};
