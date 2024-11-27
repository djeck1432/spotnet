import React, { useState } from 'react';
import TokenSelector from 'components/TokenSelector';
import BalanceCards from 'components/BalanceCards';
import MultiplierSelector from 'components/MultiplierSelector';
import { handleTransaction } from 'services/transaction';
import Spinner from 'components/spinner/Spinner';
import { ReactComponent as AlertHexagon } from 'assets/icons/alert_hexagon.svg';
import './form.css';
import { createPortal } from 'react-dom';
import useLockBodyScroll from 'hooks/useLockBodyScroll';
import CongratulationsModal from 'components/congratulationsModal/CongratulationsModal';
import StyledPopup from 'components/openpositionpopup/StyledPopup';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Button from 'components/ui/Button/Button';
import { useConnectWallet } from 'hooks/useConnectWallet';

const Form = ({ walletId, setWalletId }) => {
  const [tokenAmount, setTokenAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedMultiplier, setSelectedMultiplier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  useLockBodyScroll(successful);
  const [showPopup, setShowPopup] = useState(false);

  const connectWalletMutation = useConnectWallet(setWalletId);

  const { data: positionData, refetch: refetchPosition } = useQuery({
    queryKey: ['hasOpenPosition', walletId],
    queryFn: async () => {
      if (!walletId) return { has_opened_position: false };
      const { data } = await axios.get('/api/has-user-opened-position', {
        params: { wallet_id: walletId },
      });
      return data;
    },
    enabled: !!walletId,
  });

  const connectWalletHandler = () => {
    connectWalletMutation.mutate();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let connectedWalletId = walletId;
    if (!connectedWalletId) {
      connectWalletHandler();
      return;
    }

    await refetchPosition();
    if (positionData?.has_opened_position) {
      setShowPopup(true);
      return;
    }

    if (tokenAmount === '' || selectedToken === '' || selectedMultiplier === '') {
      setAlertMessage('Please fill the form');
      return;
    }

    setAlertMessage('');

    const formData = {
      wallet_id: connectedWalletId,
      token_symbol: selectedToken,
      amount: tokenAmount,
      multiplier: selectedMultiplier,
    };
    await handleTransaction(connectedWalletId, formData, setError, setTokenAmount, setLoading, setSuccessful);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleClosePosition = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="form-content-wrapper">
      <BalanceCards walletId={walletId} />
      {successful && createPortal(<CongratulationsModal />, document.body)}
      <StyledPopup isOpen={showPopup} onClose={handleClosePopup} onClosePosition={handleClosePosition} />
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-title">
          <h1>Please submit your leverage details</h1>
        </div>
        {alertMessage && (
          <p className="error-message form-alert">
            {alertMessage} <AlertHexagon className="form-alert-hex" />
          </p>
        )}
        <label>Select Token</label>
        <TokenSelector selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
        <label>Select Multiplier</label>
        <MultiplierSelector
          setSelectedMultiplier={setSelectedMultiplier}
          selectedToken={selectedToken}
          sliderValue={selectedMultiplier}
        />
        <div className="token-label">
          <label>Token Amount</label>
          {error && <p className="error-message">{error}</p>}
          <input
            type="number"
            placeholder="Enter Token Amount"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            className={error ? 'error' : ''}
          />
        </div>
        <div>
          <div className="form-button-container">
            <Button variant="secondary" size="lg" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
      <Spinner loading={loading} />
    </div>
  );
};

export default Form;
