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
  const { data: dashboardData } = useDashboardData();

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
        positionId: dashboardData.position_id,
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
      <div className="flex flex-col items-center justify-center gap-2 pt-6 text-center">
        <div className="flex w-full max-w-3xl justify-center gap-4">
          <Card
            label="Health Factor"
            value={dashboardData?.health_ratio}
            icon={<HealthIcon className="w-4 h-4" />}
          />
          <Card
            label="Borrow Balance"
            value={formatNumber(dashboardData?.borrowed, true)}
            icon={<EthIcon className="w-4 h-4" />}
          />
        </div>
      </div>
      <h1 className="text-xl font-normal text-white text-center mt-8 mb-0">
        Please make a deposit
      </h1>
      <TokenSelector
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        className="rounded-lg"
      />
      <div
        className="relative mx-auto mt-8 mb-6 max-w-md w-36 text-center font-semibold text-4xl"
        aria-labelledby="amount-input-label"
      >
        <input
          type="text"
          id="amount-field"
          value={amount}
          onChange={handleAmountChange}
          pattern="^\d*\.?\d*$"
          className="w-full bg-transparent text-gray outline-none text-center text-6xl"
          aria-describedby="currency-symbol"
          placeholder="0.00"
          disabled={isLoading}
        />
        <span
          id="currency-symbol"
          className="absolute top-0 right-0 -translate-y-3/4 translate-x-3/4 text-secondary text-lg"
        >
          {selectedToken}
        </span>
      </div>

      <Button
        size="lg"
        className="w-full max-w-lg"
        variant="primary"
        onClick={handleDeposit}
        disabled={isLoading || amount === '0'}
      >
        {isLoading ? 'Processing...' : 'Deposit'}
      </Button>
    </DashboardLayout>
  );
};
