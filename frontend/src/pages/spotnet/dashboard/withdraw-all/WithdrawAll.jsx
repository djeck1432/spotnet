import React, { useState } from 'react';
import BalanceCards from 'components/BalanceCards';
import { ReactComponent as ETH } from '../../../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../../../assets/icons/strk.svg';
import './withdraw_all.css';
import { useWalletStore } from 'stores/useWalletStore';
import Button from 'components/ui/Button/Button';
import { ReactComponent as AlertHexagon } from 'assets/icons/alert_hexagon.svg';
import { axiosInstance } from 'utils/axios';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();
  const [balances, setBalances] = useState([
    { icon: <ETH />, title: 'ETH', balance: '0.00' },
    { icon: <USDC />, title: 'USDC', balance: '0.00' },
    { icon: <STRK />, title: 'STRK', balance: '0.00' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWithdrawAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/withdraw-all?wallet_id=${walletId}`);
      console.log(response);
      if (response.status === 200) {
        console.log('Withdraw All operation completed successfully.');
      } else {
        console.log('Failed to complete the Withdraw All operation.');
      }
    } catch (error) {
      console.error('Error during Withdraw All operation:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdrawall-wrapper">
      <div className="withdrawall-container">
        <BalanceCards balances={balances} setBalances={setBalances} walletId={walletId} />
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
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Withdraw All'}
        </Button>
        {error && (
          <div className="error-message">
            Error: {error} <AlertHexagon className="form-alert-hex" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawAll;