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
import Button from 'components/ui/Button/Button';
import { useWalletStore } from 'stores/useWalletStore';
import { useConnectWallet } from 'hooks/useConnectWallet';
import { useCheckPosition } from 'hooks/useClosePosition';
import { useNavigate } from 'react-router-dom';
import { ActionModal } from 'components/ui/ActionModal';

const Form = () => {
  const navigate = useNavigate();
  const { walletId, setWalletId } = useWalletStore();
  const [tokenAmount, setTokenAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedMultiplier, setSelectedMultiplier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  useLockBodyScroll(successful);
  const [isClosePositionOpen, setClosePositionOpen] = useState(false);
  const connectWalletMutation = useConnectWallet(setWalletId);
  const { data: positionData, refetch: refetchPosition } = useCheckPosition();

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
    if (!positionData?.has_opened_position) {
      setClosePositionOpen(true);
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

  const handleCloseModal = () => {
    setClosePositionOpen(false);
  };

  const onClosePositionAction = () => {
    navigate('/dashboard');
  };

  return (
    <div className="form-content-wrapper">
      <BalanceCards walletId={walletId} />
      {successful && createPortal(<CongratulationsModal />, document.body)}
      {isClosePositionOpen && (
        <ActionModal
          isOpen={isClosePositionOpen}
          title="Open New Position"
          subTitle="Do you want to open new a position?"
          content={[
            'You have already opened a position.',
            'Please close active position to open a new one.',
            'Click the ‘Close Active Position’ button to continue.',
          ]}
          cancelLabel="Cancel"
          submitLabel="Close Active Position"
          submitAction={onClosePositionAction}
          cancelAction={handleCloseModal}
        />
      )}
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
