import React from 'react';
import BalanceCards from 'components/ui/balance-cards/BalanceCards';
import './withdraw_all.css';
import { useWalletStore } from 'stores/useWalletStore';
import Button from 'components/ui/Button/Button';
import useWithdrawAll from 'hooks/useWithdrawAll';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();

  const { withdrawAll, isLoading } = useWithdrawAll();
  const handleWithdrawAll = () => {
    withdrawAll(walletId);
  };

  return (
    <div className="withdrawall-wrapper">
      <div className="withdrawall-container">
        <BalanceCards />
        <div className="withdrawall-content">
          <div className="withdrawall-title">
            <h1>Please take special note</h1>
          </div>

          <div className="withdrawall-info-card">
            Clicking on the `Withdraw All` button means you are agreeing to close all positions and get all tokens
            transferred to your wallet.
          </div>
          <Button
            className="withdrawall-btn"
            variant="secondary"
            size="lg"
            type="button"
            onClick={handleWithdrawAll}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Withdraw All'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawAll;
