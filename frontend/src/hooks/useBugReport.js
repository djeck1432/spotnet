import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'utils/axios';
import { generateTelegramLink } from 'services/telegram';
import { notify } from 'components/layout/notifier/Notifier';

export const useBugReport = (walletId, bugDescription, onClose) => {
  const mutation = useMutation({
    mutationFn: async () => {
      if (!window?.Telegram?.WebApp?.initData?.user?.id) {
        const { subscription_link } = await generateTelegramLink(walletId);
        window.open(subscription_link, '_blank');
        return;
      }

      return await axiosInstance.post(`/api/save-bug-report`, {
        telegram_id: window?.Telegram?.WebApp?.initData?.user?.id,
        wallet_id: walletId,
        bug_description: bugDescription,
      });
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
