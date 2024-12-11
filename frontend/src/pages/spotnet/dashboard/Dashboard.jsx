import React, { useEffect, useState } from 'react';
import './dashboard.css';
import newIcon from '../../../assets/icons/borrow-balance-icon.png';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as StrkIcon } from 'assets/icons/strk.svg';
import { ReactComponent as UsdIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';
import { ReactComponent as CollateralIcon } from 'assets/icons/collateral_dynamic.svg';
import { ReactComponent as BorrowIcon } from 'assets/icons/borrow_dynamic.svg';
import { ReactComponent as TelegramIcon } from 'assets/icons/telegram_dashboard.svg';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Spinner from 'components/spinner/Spinner';
// import { ZETH_ADDRESS } from 'utils/constants';
import useDashboardData from 'hooks/useDashboardData';
import { useClosePosition, useCheckPosition } from 'hooks/useClosePosition';
import Button from 'components/ui/Button/Button';
import { useWalletStore } from 'stores/useWalletStore';
import { ActionModal } from 'components/ui/ActionModal';
import useTelegramNotification from 'hooks/useTelegramNotification';
import { ReactComponent as AlertHexagon } from 'assets/icons/alert_hexagon.svg';

export default function Component({ telegramId }) {
  const { walletId } = useWalletStore();
  const [isCollateralActive, setIsCollateralActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const { data, isLoading } = useDashboardData(walletId) || {
    data: { health_ratio: '1.5', current_sum: '0.05', start_sum: '0.04', borrowed: '10.0' },
    isLoading: false,
  };
  const { mutate: closePositionEvent, isLoading: isClosing, error: closePositionError } = useClosePosition(walletId);
  const { data: positionData } = useCheckPosition();
  const { subscribe } = useTelegramNotification();

  const hasOpenedPosition = positionData?.has_opened_position;

  const handleSubscribe = () => subscribe({ telegramId, walletId });

  const [cardData, setCardData] = useState([
    {
      title: 'Collateral & Earnings',
      icon: CollateralIcon,
      balance: '0.00',
      currencyName: 'Ethereum',
      currencyIcon: EthIcon,
    },
    {
      title: 'Borrow',
      icon: BorrowIcon,
      balance: '0.0',
      currencyName: 'USD Coin',
      currencyIcon: UsdIcon,
    },
  ]);

  const [healthFactor, setHealthFactor] = useState('0.00');
  const [startSum, setStartSum] = useState(0);
  const [currentSum, setCurrentSum] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching data for walletId:', walletId);
  }, [walletId]);

  useEffect(() => {
    const getData = async () => {
      if (isLoading) {
        return;
      }
      console.log('Data:', data);

      if (!walletId) {
        console.error('getData: walletId is undefined');
        setLoading(false);
        return;
      }

      if (!data) {
        console.error('Data is missing');
        setLoading(false);
        return;
      }

      const { health_ratio, current_sum, start_sum, borrowed, multipliers, balance } = data;

      let currencyName = 'Ethereum';
      let currencyIcon = EthIcon;

      if (multipliers) {
        if (multipliers.STRK) {
          currencyName = 'STRK';
          currencyIcon = StrkIcon;
        } else if (multipliers.ETH) {
          currencyName = 'Ethereum';
          currencyIcon = EthIcon;
        } else if (multipliers.USDC) {
          currencyName = 'USDC';
          currencyIcon = UsdIcon;
        }
      }

      // Update card data using the new data structure
      const updatedCardData = [
        {
          title: 'Collateral & Earnings',
          icon: CollateralIcon,
          balance: balance,
          currencyName: currencyName,
          currencyIcon: currencyIcon,
        },
        {
          title: 'Borrow',
          icon: BorrowIcon,
          balance: borrowed,
          currencyName: 'USD Coin',
          currencyIcon: UsdIcon,
        },
      ];

      setCardData(updatedCardData);
      setHealthFactor(health_ratio || '0.00');
      setCurrentSum(current_sum || 0);
      setStartSum(start_sum || 0);
      setLoading(false);
    };

    getData();
  }, [walletId, data, isLoading]);

  const getCurrentSumColor = () => {
    if (currentSum > startSum) return 'current-sum-green';
    if (currentSum < startSum) return 'current-sum-red';
    return '';
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {loading && <Spinner loading={loading} />}
        <h1 className="dashboard-title">zkLend Position</h1>
        <div className="dashboard-content">
          <div className="top-cards-dashboard">
            <div className="card">
              <div className="card-header">
                <HealthIcon className="icon" />
                <span className="label">Health Factor</span>
              </div>
              <div className="card-value">
                <span className="top-card-value">{healthFactor}</span>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <img src={newIcon} alt="Borrow Balance Icon" className="icon" />{' '}
                <span className="label">Borrow Balance</span>
              </div>
              <div className="card-value">
                <span className="currency-symbol">$</span>
                <span className="top-card-value">
                  {' '}
                  {cardData[1]?.balance ? Number(cardData[1].balance).toFixed(8) : '0.00'}
                </span>
              </div>
            </div>
          </div>
          <div className="dashboard-info-card">
            <div className="tabs">
              <button
                onClick={() => setIsCollateralActive(true)}
                className={`tab ${isCollateralActive ? 'active' : ''}`}
              >
                <CollateralIcon className="tab-icon" />
                <span className="tab-title">Collateral & Earnings</span>
              </button>

              <div className="tab-divider" />

              <button
                onClick={() => setIsCollateralActive(false)}
                className={`tab ${!isCollateralActive ? 'active borrow' : ''}`}
              >
                <BorrowIcon className="tab-icon" />
                <span className="tab-title">Borrow</span>
              </button>
              <div className="tab-indicator-container">
                <div className={`tab-indicator ${isCollateralActive ? 'collateral' : 'borrow'}`} />
              </div>
            </div>

            {isCollateralActive ? (
              <div className="tab-content">
                <div className="balance-info">
                  <div className="currency-info">
                    {React.createElement(cardData[0]?.currencyIcon || CollateralIcon, {
                      className: 'icon',
                    })}
                    <span className="currency-name">{cardData[0]?.currencyName || 'N/A'}</span>
                  </div>
                  <span>
                    <span className="balance-label">Balance: </span>
                    <span className="balance-value">
                      {cardData[0]?.balance ? Number(cardData[0].balance).toFixed(8) : '0.00'}
                    </span>
                  </span>
                  <span>
                    <span className="balance-label">Start sum: </span>
                    <span className="balance-value">
                      <span className="currency-symbol">$</span>
                      {startSum ? Number(startSum).toFixed(8) : '0.00'}
                    </span>
                  </span>
                  <span>
                    <span className="balance-label">Current sum: </span>
                    <span className={currentSum === 0 ? 'current-sum-white' : getCurrentSumColor()}>
                      <span className="currency-symbol">$</span>
                      {currentSum ? Number(currentSum).toFixed(8) : '0.00'}
                      {currentSum > startSum && currentSum !== 0 && <TrendingUp className="lucide-up-icon" />}
                      {currentSum < startSum && currentSum !== 0 && <TrendingDown className="lucide-down-icon" />}
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="tab-content">
                <div className="balance-info">
                  <div className="currency-info">
                    {React.createElement(cardData[1]?.currencyIcon || BorrowIcon, {
                      className: 'icon',
                    })}
                    <span className="currency-name">{cardData[1]?.currencyName || 'N/A'}</span>
                  </div>
                  <span>
                    <span className="balance-label">Balance: </span>
                    <span className="balance-value">
                      {cardData[1]?.balance ? Number(cardData[1].balance).toFixed(8) : '0.00'}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="lg"
            className="dashboard-btn"
            onClick={() => closePositionEvent()}
            disabled={isClosing || !hasOpenedPosition}
          >
            {isClosing ? 'Closing...' : 'Redeem'}
          </Button>
          {closePositionError && (
            <div className="error-message">
              Error: {closePositionError.message} <AlertHexagon className="form-alert-hex" />
            </div>
          )}
          <Button variant="secondary" size="lg" className="dashboard-btn" onClick={handleOpen}>
            <TelegramIcon className="tab-icon" />
            Enable telegram notification bot
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
        </div>
      </div>
    </div>
  );
}
