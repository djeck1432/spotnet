import React, { useState } from 'react';
import TokenSelector from 'components/ui/token-selector/TokenSelector';
import BalanceCards from 'components/ui/balance-cards/BalanceCards';
import MultiplierSelector from 'components/ui/multiplier-selector/MultiplierSelector';
import { handleTransaction } from 'services/transaction';
import Spinner from 'components/ui/spinner/Spinner';
import './form.css';
import { createPortal } from 'react-dom';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import CongratulationsModal from '../../components/layout/congratulations-modal/CongratulationsModal';
import Button from 'components/ui/Button/Button';
import { useWalletStore } from '../../stores/useWalletStore';
import { useConnectWallet } from '../../hooks/useConnectWallet';
import { useCheckPosition } from '../../hooks/useClosePosition';
import { useNavigate } from 'react-router-dom';
import { ActionModal } from '../../components/ui/action-modal';
import { useHealthFactor } from '../../hooks/useHealthRatio';
import { notify } from '../../components/layout/notifier/Notifier';

const Form = () => {
  const navigate = useNavigate();
  const { walletId, setWalletId } = useWalletStore();
  const [tokenAmount, setTokenAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedMultiplier, setSelectedMultiplier] = useState('');
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  
  useLockBodyScroll(successful);
  const [isClosePositionOpen, setClosePositionOpen] = useState(false);
  const connectWalletMutation = useConnectWallet(setWalletId);
  const { data: positionData, refetch: refetchPosition } = useCheckPosition();

  const { healthFactor, isLoading: isHealthFactorLoading } = useHealthFactor(
    selectedToken,
    tokenAmount,
    selectedMultiplier
  );

  const connectWalletHandler = () => {
    if (!walletId) {
      connectWalletMutation.mutate();
    }
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
      setClosePositionOpen(true);
      return;
    }

    if (tokenAmount === '' || selectedToken === '' || selectedMultiplier === '') {
      notify("Please fill the form", 'error')
      return;
    }

    const formData = {
      wallet_id: connectedWalletId,
      token_symbol: selectedToken,
      amount: tokenAmount,
      multiplier: selectedMultiplier,
    };
    await handleTransaction(connectedWalletId, formData, setTokenAmount, setLoading, setSuccessful);
  };

  const handleCloseModal = () => {
    setClosePositionOpen(false);
  };

  const onClosePositionAction = () => {
    navigate('/dashboard');
  };

  return (
    <div className="form-content-wrapper">
      <BalanceCards />
      {successful && createPortal(<CongratulationsModal />, document.body)}
      {isClosePositionOpen && (
        <ActionModal
          isOpen={isClosePositionOpen}
          title="Open New Position"
          subTitle="Do you want to open new a position?"
          content={[
            'You have already opened a position.',
            'Please close active position to open a new one.',
            "Click the 'Close Active Position' button to continue.",
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
        <label className="token-select">Select Token</label>
        <TokenSelector selectedToken={selectedToken} setSelectedToken={setSelectedToken} />
        <label>Select Multiplier</label>
        <MultiplierSelector
          setSelectedMultiplier={setSelectedMultiplier}
          selectedToken={selectedToken}
          sliderValue={selectedMultiplier}
        />
        <div className="token-label">
          <label className="token-amount">Token Amount</label>
          <input
            type="number"
            placeholder="Enter Token Amount"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
          />
        </div>
        <div>
          <div className="form-health-factor">
            <p>
              Estimated Health Factor Level:
            </p>
            <p>
          {isHealthFactorLoading ? 'Loading...' : healthFactor}
        </p>
          </div>
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