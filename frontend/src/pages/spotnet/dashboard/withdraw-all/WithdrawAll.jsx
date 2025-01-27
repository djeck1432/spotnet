import React from 'react';
import DashboardLayout from '../../../DashboardLayout';
import BalanceCards from 'components/ui/balance-cards/BalanceCards';
import { useWalletStore } from 'stores/useWalletStore';
import { Button } from 'components/ui/custom-button/Button';
import useWithdrawAll from 'hooks/useWithdrawAll';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();
  const { withdrawAll, isLoading } = useWithdrawAll();

  const handleWithdrawAll = () => {
    withdrawAll(walletId);
  };

  return (
    <DashboardLayout title="Withdraw All">
      <BalanceCards className="balance-card-withdraw" />
      <div className="withdrawall-content">
        <div className="withdrawall-title">
          <h1 className="text-center font-normal text-lg mb-2">Please take special note</h1>
        </div>

        <div className="withdrawall-info-card bg-warning-alt border border-warning text-second-primary text-center p-2.5 flex flex-col justify-center items-center rounded-lg w-full max-w-[642px] h-[98px] mx-auto mt-12 mb-12 gap-5 md:max-w-[530px] md:h-[168px] md:px-6 md:py-4 md:gap-0 sm:max-w-[480px] sm:h-auto sm:mt-9 sm:mb-9 sm:px-6 sm:text-sm sm:flex-wrap sm:gap-4 sm:w-[480px]">
          Clicking on the `Withdraw All` button means you are agreeing to close all positions and get all tokens
          transferred to your wallet.
        </div>
        <Button
          variant="primary"
          className="withdraw-all-btn w-full max-w-[642px] mt-4 md:max-w-[530px] sm:max-w-[480px] sm:w-[480px] xs:max-w-[380px] xs:w-[380px]"
          size="lg"
          type="button"
          onClick={handleWithdrawAll}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Withdraw All'}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default WithdrawAll;
