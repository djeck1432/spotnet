import React, { useState } from 'react';
import { ReactComponent as HealthIcon } from 'assets/icons/health.svg';
import { ReactComponent as EthIcon } from 'assets/icons/ethereum.svg';
import { useAddDeposit } from 'hooks/useAddDeposit';
import DashboardLayout from '../DashboardLayout';
import Card from 'components/ui/card/Card';
import TokenSelector from 'components/ui/token-selector/TokenSelector';
import { NUMBER_REGEX } from 'utils/regex';
import { Button } from 'components/ui/custom-button/Button';
import useDashboardData from 'hooks/useDashboardData';

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
        <div className="flex w-full max-w-3xl justify-center gap-2">
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
      <h1 className="text-2xl font-normal text-primary text-center mt-8 mb-0">
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
          className="w-full bg-transparent text-gray-700 outline-none text-center"
          aria-describedby="currency-symbol"
          placeholder="0.00"
          disabled={isLoading}
        />
        <span
          id="currency-symbol"
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-gray-400 text-lg"
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
