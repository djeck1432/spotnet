import BalanceCards from '@/components/ui/balance-cards/BalanceCards';
import { Button } from '@/components/ui/custom-button/Button';
import useWithdrawAll from '@/hooks/useWithdrawAll';
import { useWalletStore } from '@/stores/useWalletStore';
import DashboardLayout from '@/pages/DashboardLayout.jsx';

const WithdrawAll = () => {
  const { walletId } = useWalletStore();
  const { withdrawAll, isLoading } = useWithdrawAll();

  const handleWithdrawAll = () => {
    withdrawAll(walletId);
  };

  return (
    <DashboardLayout title="Withdraw All">
      
      <div className="flex flex-col max-w-[600px] md:max-w-[640px]">
        <BalanceCards className="max-w-4xl " />
        <h1 className="text-center text-white font-normal text-2xl my-3">Please take special note</h1>

        <div className="bg-warning-colour-alt border-x border-y border-warning-colour text-second-primary text-center p-3 flex flex-col justify-center items-center rounded-lg w-full mx-auto mt-12 mb-12 gap-5 md:px-6 md:py-4 md:gap-0 sm:mt-9 sm:mb-9 sm:px-6 sm:text-lg sm:flex-wrap sm:gap-4">
          Clicking on the `Withdraw All` button means you are agreeing to close all positions and get all tokens
          transferred to your wallet.
        </div>
        <Button
          variant="primary"
          className="w-full mt-4"
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

