import EthIcon from '@/assets/icons/ethereum.svg?react';
import HealthIcon from '@/assets/icons/health.svg?react';
import Card from '@/components/ui/card/Card';
import { Button } from '@/components/ui/custom-button/Button';
import TokenSelector from '@/components/ui/token-selector/TokenSelector';
import { useAddDeposit } from '@/hooks/useAddDeposit';
import useDashboardData from '@/hooks/useDashboardData';
import { NUMBER_REGEX } from '@/utils/regex';
import { useState } from 'react';
import DashboardLayout from '../DashboardLayout';

export const AddDeposit = () => {
  const formatNumber = (value, currency = false) => {
    const number = parseFloat(value);
    if (isNaN(number)) return currency ? '$0.00' : '0';
    return currency ? `$${number.toFixed(2)}` : number.toFixed();
  };

  const [amount, setAmount] = useState('0');
  const [selectedToken, setSelectedToken] = useState('STRK');
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardData();

  const { mutate: addDeposit, isLoading } = useAddDeposit();

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (NUMBER_REGEX.test(value)) {
      setAmount(value);
    }
  };

  const handleDeposit = () => {
    addDeposit(
      {
        positionId: dashboardData?.position_id,
        amount,
        tokenSymbol: selectedToken,
      },
      {
        onSuccess: () => {
          setAmount('0');
          setSelectedToken('STRK');
        },
      }
    );
  };

  return (
    <DashboardLayout title="Add Deposit">
      <div className="text-primary flex w-full flex-col items-center justify-center gap-0.5 rounded-lg pt-6 text-center">
        <div className="flex w-full gap-2">
          <Card
            label="Health Factor"
            value={dashboardData?.health_ratio}
            icon={
              <HealthIcon className="bg-border-color mr-[5px] flex h-8 w-8 items-center justify-center rounded-full p-2" />
            }
            labelClassName="text-stormy-gray"
          />
          <Card
            label="Borrow Balance"
            value={formatNumber(dashboardData?.borrowed, true)}
            icon={
              <EthIcon className="bg-border-color mr-[5px] flex h-8 w-8 items-center justify-center rounded-full p-2" />
            }
            labelClassName="text-stormy-gray"
          />
        </div>
      </div>
      <h1 className="text-primary mt-8 mb-0 text-center text-xl font-normal md:mt-0">Please make a deposit</h1>
      <TokenSelector
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className="rounded-lg border-none"
      />
      <div className="relative mx-auto my-8 w-[146px] max-w-[400px] text-center font-semibold">
        <input
          type="text"
          id="amount-field"
          value={amount}
          onChange={handleAmountChange}
          pattern="^\d*\.?\d*$"
          className="text-gray w-full border-none bg-transparent text-center text-[64px] font-semibold outline-none"
          aria-describedby="currency-symbol"
          placeholder="0.00"
          disabled={isLoading || isDashboardLoading}
        />
        <span
          id="currency-symbol"
          className="text-dark-gray absolute top-[18%] z-[999999] -translate-x-1/2 -translate-y-1/2 text-base leading-[20.83px] opacity-50"
        >
          {selectedToken}
        </span>
      </div>

      <Button
        size="lg"
        className="mt-4 w-full"
        variant="primary"
        onClick={handleDeposit}
        disabled={isLoading || isDashboardLoading || amount === '0'}
      >
        {isLoading ? 'Processing...' : 'Deposit'}
      </Button>
    </DashboardLayout>
  );
};
