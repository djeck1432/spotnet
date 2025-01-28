import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/utils/axios';
import { notify } from '@/components/layout/notifier/Notifier';

export const useBugReport = (walletId, bugDescription, onClose) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const user_id = window?.Telegram?.WebApp?.initData?.user?.id;
      const data = {
        wallet_id: walletId,
        bug_description: bugDescription,
      };
      if (user_id) data.telegram_id = user_id;
      return await axiosInstance.post(`/api/save-bug-report`, data);
    },
    onSuccess: () => {
      notify('Report sent successfully!');
      onClose();
    },
    onError: (error) => {
      notify(error.response?.data?.message || 'Report failed!', 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bugDescription.trim()) {
      notify('Bug description cannot be empty!', 'error');
      return;
    }
    onClose();
    mutation.mutate();
  };

  return { mutation, handleSubmit };
};
