import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import { ReactComponent as EthIcon } from '../../assets/icons/ethereum.svg';
import { ReactComponent as StrkIcon } from '../../assets/icons/strk.svg';
import { ReactComponent as UsdIcon } from '../../assets/icons/usd_coin.svg';
import { ReactComponent as BorrowIcon } from '../../assets/icons/borrow_dynamic.svg';
import { ReactComponent as TelegramIcon } from '../../assets/icons/telegram_dashboard.svg';
import Spinner from '../../components/ui/spinner/Spinner';
import useDashboardData from '../../hooks/useDashboardData';
import { useClosePosition, useCheckPosition } from '../../hooks/useClosePosition';
import { Button } from 'components/ui/custom-button/Button';
import { useWalletStore } from '../../stores/useWalletStore';
import { ActionModal } from '../../components/ui/action-modal';
import useTelegramNotification from '../../hooks/useTelegramNotification';
import Borrow from '../../components/dashboard/borrow/Borrow';
import { ReactComponent as CollateralIcon } from '../../assets/icons/collateral_dynamic.svg';
import Collateral from '../../components/dashboard/collateral/Collateral';
import Card from '../../components/ui/card/Card';
import { ReactComponent as HealthIcon } from '../../assets/icons/health.svg';
import Deposited from 'components/dashboard/deposited/Deposited';
import DashboardTabs from 'components/dashboard/dashboard-tab/DashboardTabs';
import { DASHBOARD_TABS } from 'utils/constants';

export default function DashboardPage({ telegramId }) {
  const { walletId } = useWalletStore();
  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const { data, isLoading } = useDashboardData(walletId) || {
    data: { health_ratio: '1.5', current_sum: '0.05', start_sum: '0.04', borrowed: '10.0' },
    isLoading: false,
  };
  const { mutate: closePositionEvent, isLoading: isClosing } = useClosePosition(walletId);
  const { data: positionData } = useCheckPosition();
  const { subscribe } = useTelegramNotification();

  const hasOpenedPosition = positionData?.has_opened_position;
  const { COLLATERAL, BORROW, DEPOSITED } = DASHBOARD_TABS;

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
      balance: '0.00',
      currencyName: 'USD Coin',
      currencyIcon: UsdIcon,
    },
  ]);

  const [healthFactor, setHealthFactor] = useState('0.00');
  const [startSum, setStartSum] = useState(0);
  const [currentSum, setCurrentSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(COLLATERAL);

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
    if (currentSum > startSum) return 'text-green-500';
    if (currentSum < startSum) return 'text-red-500';
    return '';
  };

  const depositedData = { eth: 1, strk: 12, usdc: 4, usdt: 9 };

  return (
    <DashboardLayout>
      {loading && <Spinner loading={loading} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          label="Health Factor"
          value={healthFactor}
          icon={<HealthIcon className="w-6 h-6" />}
        />
        <Card
          label="Borrow Balance"
          cardData={cardData}
          icon={<EthIcon className="w-6 h-6" />}
        />
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-md">
          <DashboardTabs activeTab={activeTab} switchTab={setActiveTab} />

          {activeTab === COLLATERAL && (
            <Collateral
              getCurrentSumColor={getCurrentSumColor}
              startSum={startSum}
              currentSum={currentSum}
              data={cardData}
            />
          )}

          {activeTab === BORROW && <Borrow data={cardData} />}

          {activeTab === DEPOSITED && <Deposited data={depositedData} />}
        </div>
        <Button
          className="w-full sm:w-auto py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          variant="primary"
          size="lg"
          onClick={() => closePositionEvent()}
          disabled={isClosing || !hasOpenedPosition}
        >
          {isClosing ? 'Closing...' : 'Redeem'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={handleOpen}
        >
          <TelegramIcon className="w-5 h-5 mr-2" />
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
    </DashboardLayout>
  );
}
