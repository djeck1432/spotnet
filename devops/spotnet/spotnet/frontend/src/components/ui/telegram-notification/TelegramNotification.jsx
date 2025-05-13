import React, { useState } from 'react';
import TelegramIcon from '@/assets/icons/telegram_dashboard.svg?react';
import { ActionModal } from '@/components/ui/action-modal';
import { Button } from '@/components/ui/custom-button/Button';
import useTelegramNotification from '@/hooks/useTelegramNotification';
import { useWalletStore } from '@/stores/useWalletStore';

export function TelegramNotification({ telegramId }) {
  const [showModal, setShowModal] = useState(false);
  const { walletId } = useWalletStore();
  const { subscribe } = useTelegramNotification();

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleSubscribe = () => {
    subscribe({ telegramId, walletId });
    handleClose();
  };

  return (
    <>
      <Button variant="secondary" size="lg" onClick={handleOpen} className="hidden md:flex">
        <span className="flex items-center justify-center gap-2">
          <TelegramIcon className="h-6 w-6" />
          Enable telegram notification bot
        </span>
      </Button>
      {showModal && (
        <ActionModal
          isOpen={showModal}
          title="Telegram Notification"
          subTitle="Do you want to enable telegram notification bot?"
          content={[
            'This will allow you to receive quick notifications on your telegram line in realtime. You can disable this setting anytime.',
          ]}
          cancelLabel="Cancel"
          submitLabel="Yes, Sure"
          submitAction={handleSubscribe}
          cancelAction={handleClose}
        />
      )}
    </>
  );
}
