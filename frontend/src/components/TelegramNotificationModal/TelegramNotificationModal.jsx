import React from 'react';
import './telegramNotificationModal.css';
import useTelegramNotification from 'hooks/useTelegramNotification';
import Button from 'components/ui/Button/Button';

const TelegramNotificationModal = ({ onClose, telegramId, walletId }) => {
  const { subscribe, isLoading } = useTelegramNotification();

  const handleSubscribe = () => {
    subscribe({ telegramId, walletId });
  };

  return (
    <div className="notification-overlay">
      <div className="notification-backdrop" onClick={onClose} />
      <div className="notification-wrapper">
        <div className="notification-box">
          <div className="notification-content">
            <div className="notification-title">Telegram Notification</div>
            <h2>
              Do you want to enable telegram <br />
              notification bot?
            </h2>
            <p>
              This will allow you to receive quick notifications on your telegram line in realtime. You can disable this
              setting anytime.
            </p>
          </div>
          <div className="notification-actions">
            <Button variant="secondary" size="md" className="notification-btn" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSubscribe} disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Yes, Sure'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramNotificationModal;
