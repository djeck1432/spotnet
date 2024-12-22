import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'utils/axios';
import { toast } from 'react-toastify';

export const useAddDeposit = () => {
  const mutation = useMutation({
    mutationFn: async ({ positionId, amount, tokenSymbol }) => {
      const { data } = await axiosInstance.post(`/api/add-extra-deposit/${positionId}`, {
        position_id: positionId,
        amount: parseFloat(amount),
        token_symbol: tokenSymbol,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Deposit successful!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to process deposit');
    },
  });

  return mutation;
};