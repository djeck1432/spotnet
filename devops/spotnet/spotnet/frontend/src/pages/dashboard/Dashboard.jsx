import HealthIcon from '@/assets/icons/health.svg?react';
import EthIcon from '@/assets/icons/ethereum.svg?react';
import Card from '@/components/ui/card/Card';
import { Button } from '@/components/ui/custom-button/Button';
import Spinner from '@/components/ui/spinner/Spinner';
import { useCheckPosition, useClosePosition } from '@/hooks/useClosePosition';
import useDashboardData from '@/hooks/useDashboardData';
import { useWalletStore } from '@/stores/useWalletStore';
import DashboardLayout from '../DashboardLayout';
import DashboardInfoCard from '@/components/dashboard/dashboardCard/DashboardInfoCard';
import { TelegramNotification } from '@/components/ui/telegram-notification/TelegramNotification';

export default function DashboardPage({ telegramId }) {
  const { walletId } = useWalletStore();

  const { cardData, healthFactor, startSum, currentSum, depositedData, isLoading } = useDashboardData();

  const { mutate: closePositionEvent, isLoading: isClosing } = useClosePosition(walletId);

  const { data: positionData } = useCheckPosition();

  const hasOpenedPosition = positionData?.has_opened_position;

  return (
    <DashboardLayout>
      <Spinner loading={isLoading} />
      <div className="flex w-full gap-2 pt-6">
        <Card
          label="Health Factor"
          value={healthFactor}
          icon={
            <HealthIcon className="bg-border-color mr-1 flex size-6 items-center justify-center rounded-full p-1 md:size-8 md:p-2" />
          }
          labelClassName="text-stormy-gray"
        />
        <Card
          label="Borrow Balance"
          cardData={cardData}
          icon={
            <EthIcon className="bg-border-color mr-1 flex size-6 items-center justify-center rounded-full p-1 md:size-8 md:p-2" />
          }
          labelClassName="text-stormy-gray"
        />
      </div>
      <div className="flex flex-col items-center gap-6">
        <DashboardInfoCard
          cardData={cardData}
          startSum={startSum}
          currentSum={currentSum}
          depositedData={depositedData}
        />
        <div className="flex w-full flex-col gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => closePositionEvent()}
            disabled={isClosing || !hasOpenedPosition}
          >
            {isClosing ? 'Closing...' : 'Redeem'}
          </Button>
          <TelegramNotification telegramId={telegramId} />
        </div>
      </div>
    </DashboardLayout>
  );
}
