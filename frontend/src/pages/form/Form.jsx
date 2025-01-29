import React, { useState } from 'react';
import TokenSelector from '@/components/ui/token-selector/TokenSelector';
import BalanceCards from '@/components/ui/balance-cards/BalanceCards';
import MultiplierSelector from '@/components/ui/multiplier-selector/MultiplierSelector';
import { handleTransaction } from '@/services/transaction';
import Spinner from '@/components/ui/spinner/Spinner';
import { Button } from '@/components/ui/custom-button/Button';
import { useWalletStore } from '@/stores/useWalletStore';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useCheckPosition } from '@/hooks/useClosePosition';
import { useNavigate } from 'react-router-dom';
import { ActionModal } from '@/components/ui/action-modal';
import { useHealthFactor } from '@/hooks/useHealthRatio';
import { notify } from '@/components/layout/notifier/Notifier';

const Form = () => {
  const navigate = useNavigate();
  const { walletId, setWalletId } = useWalletStore();
  const [tokenAmount, setTokenAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [selectedMultiplier, setSelectedMultiplier] = useState('');
  const [loading, setLoading] = useState(false);

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
      notify('Please fill the form', 'error');
      return;
    }

    const formData = {
      wallet_id: connectedWalletId,
      token_symbol: selectedToken,
      amount: tokenAmount,
      multiplier: selectedMultiplier,
    };
    await handleTransaction(connectedWalletId, formData, setTokenAmount, setLoading);
  };

  const handleCloseModal = () => {
    setClosePositionOpen(false);
  };

  const onClosePositionAction = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-8 items-center pt-4 pb-4 font-sans min-h-screen">
      <BalanceCards className="w-full max-w-2xl" />

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
      <form
        className="flex flex-col gap-4 w-full max-w-2xl p-4"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <h1 className="text-xl font-normal text-white text-center mb-4">Please submit your leverage details</h1>
        </div>

        <TokenSelector
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          className=""
        />
        <label className="text-gray text-lg">Select Multiplier</label>
        <MultiplierSelector
          setSelectedMultiplier={setSelectedMultiplier}
          selectedToken={selectedToken}
          sliderValue={selectedMultiplier}
        />
        <div className="flex flex-col gap-2 mt-11">
          <label className="text-gray text-lg">Token Amount</label>
          <input
            type="number"
            placeholder="Enter Token Amount"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            className="border mt-2 bg-transparent border-footer-divider-bg rounded-[50px] px-7 py-4 text-gray focus:outline-none"
          />
        </div>
        <div>
          <div className="flex justify-end items-center gap-2 text-lg text-gray">
            <p>Estimated Health Factor Level:</p>
            <p>{isHealthFactorLoading ? 'Loading...' : healthFactor}</p>
          </div>
          <Button variant="secondary" size="lg" type="submit" className="w-full mt-4">
            Submit
          </Button>
        </div>
      </form>
      <Spinner loading={loading} />
    </div>
  );
};

export default Form;
