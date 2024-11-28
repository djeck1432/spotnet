import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { ReactComponent as StrkIcon } from 'assets/icons/strk.svg';
import { ReactComponent as UsdIcon } from 'assets/icons/usd_coin.svg';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';
import { ReactComponent as CollateralIcon } from 'assets/icons/collateral_dynamic.svg';
import { ReactComponent as BorrowIcon } from 'assets/icons/borrow_dynamic.svg';
import { ReactComponent as TelegramIcon } from 'assets/icons/telegram_dashboard.svg';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Spinner from 'components/spinner/Spinner';
import { ZETH_ADDRESS } from 'utils/constants';
import useDashboardData from 'hooks/useDashboardData';
import { useClosePosition } from 'hooks/useClosePosition';
import Button from 'components/ui/Button/Button';

import { useWalletStore } from 'stores/useWalletStore';
import { ActionModal } from 'components/ui/ActionModal';
import useTelegramNotification from 'hooks/useTelegramNotification';
export default function Component({ telegramId }) {
  const { walletId } = useWalletStore();
  const [isCollateralActive, setIsCollateralActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const { data, isLoading } = useDashboardData(walletId);
  const { mutate: closePositionEvent, isLoading: isClosing, error: closePositionError } = useClosePosition(walletId);

  const { subscribe } = useTelegramNotification();

  const handleSubscribe = () => {
    subscribe({ telegramId, walletId });
  };

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
    const getData = async () => {
      if (!walletId) {
        console.error('getData: walletId is undefined');
        setLoading(false);
        return;
      }

      if (!data || !data.zklend_position) {
        console.error('Data is missing or incorrectly formatted');
        setLoading(false);
        return;
      }

      if (data && data.zklend_position && data.zklend_position.products) {
        const positions = data.zklend_position.products[0].positions || [];
        const healthRatio = data.zklend_position.products[0].health_ratio;

        const cardData = positions.map((position, index) => {
          const isFirstCard = index === 0;
          const tokenAddress = position.tokenAddress;

          if (isFirstCard) {
            const isEthereum = tokenAddress === ZETH_ADDRESS;
            const balance = parseFloat(position.totalBalances[Object.keys(position.totalBalances)[0]]);
            setCurrentSum(data.current_sum);
            setStartSum(data.start_sum);
            return {
              title: 'Collateral & Earnings',
              icon: CollateralIcon,
              balance: balance,
              currencyName: isEthereum ? 'Ethereum' : 'STRK',
              currencyIcon: isEthereum ? EthIcon : StrkIcon,
            };
          }

          return {
            title: 'Borrow',
            icon: BorrowIcon,
            balance: position.totalBalances[Object.keys(position.totalBalances)[0]],
            currencyName: 'USD Coin',
            currencyIcon: UsdIcon,
          };
        });

        setCardData(cardData);
        setHealthFactor(healthRatio);
      } else {
        console.error('Data is missing or incorrectly formatted');
      }
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
          <div className="top-cards">
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
                <EthIcon className="icon" />
                <span className="label">Borrow Balance</span>
              </div>
              <div className="card-value">
                <span className="currency-symbol">$</span>
                <span className="top-card-value">{cardData[1]?.balance || '0.00'}</span>
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
                    <span className="balance-value">{cardData[0]?.balance || '0.00'}</span>
                  </span>
                  <span>
                    <span className="balance-label">Start sum: </span>
                    <span className="balance-value">
                      <span className="currency-symbol">$</span>
                      {startSum}
                    </span>
                  </span>
                  <span>
                    <span className="balance-label">Current sum: </span>
                    <span className={currentSum === 0 ? 'current-sum-white' : getCurrentSumColor()}>
                      <span className="currency-symbol">$</span>
                      {currentSum}
                      {currentSum > startSum && currentSum !== 0 && (
                        <TrendingUp color="#60AF77" size={23} style={{ marginLeft: '8px' }} />
                      )}
                      {currentSum < startSum && currentSum !== 0 && (
                        <TrendingDown color="#F42222" size={22} style={{ marginLeft: '8px' }} />
                      )}
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
                    <span className="balance-value">{cardData[1]?.balance || '0.00'}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <Button variant="primary" size="lg" onClick={() => closePositionEvent()} disabled={isClosing}>
            {isClosing ? 'Closing...' : 'Redeem'}
          </Button>

          {closePositionError && <div>Error: {closePositionError.message}</div>}
          <Button variant="secondary" size="lg" onClick={handleOpen}>
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
