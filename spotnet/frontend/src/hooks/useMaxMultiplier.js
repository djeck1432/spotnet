import { useQuery } from '@tanstack/react-query';
import { ONE_HOUR_IN_MILLISECONDS } from '../utils/constants';
import { axiosInstance } from '../utils/axios';
import { notify } from '../components/layout/notifier/Notifier';

export const useMaxMultiplier = () => {
  const { data, isPending } = useQuery({
    queryKey: ['max-multiplier'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/get-multipliers`);
      return response.data.multipliers;
    },
    staleTime: ONE_HOUR_IN_MILLISECONDS,
    refetchInterval: ONE_HOUR_IN_MILLISECONDS,
    onError: (error) => notify(`Error using multiplier: ${error.message}`, 'error'),
  });

  return { data, isLoading: isPending };
};
