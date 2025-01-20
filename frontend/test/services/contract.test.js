import { useContractDeployment } from '../../src/services/contract';
import { axiosInstance } from '../../src/utils/axios';
import { useWalletConnection } from '../../src/services/wallet';
import { getDeployContractData } from '../../src/utils/constants';

jest.mock('../../src/utils/axios');
jest.mock('../../src/utils/constants');
jest.mock('../../src/components/layout/notifier/Notifier', () => ({
  notify: jest.fn(),
  ToastWithLink: jest.fn(),
}));
jest.mock('../../src/services/wallet', () => ({
  useWalletConnection: jest.fn(),
}));

describe('useContractDeployment Tests', () => {
  const mockWalletId = '0x123...';
  const mockTransactionHash = '0xabc...';
  const mockContractAddress = '0xdef...';

  beforeEach(() => {
    jest.clearAllMocks();

    getDeployContractData.mockReturnValue({
      contractData: 'mockContractData',
    });

    useWalletConnection.mockReturnValue({
      account: {
        deployContract: jest.fn().mockResolvedValue({
          transaction_hash: mockTransactionHash,
          contract_address: mockContractAddress,
        }),
        checkAndDeployContract: jest.fn().mockResolvedValue({

        }),
        waitForTransaction: jest.fn().mockResolvedValue(true),
      },
      isConnected: true,
    });
  });

  describe('deployContract', () => {
    it('should successfully deploy contract', async () => {

      const result = await useContractDeployment().deploycontract(mockWalletId);

      expect(useWalletConnection).toHaveBeenCalled();
      expect(useWalletConnection().account.deployContract).toHaveBeenCalledWith({
        contractData: 'mockContractData',
      });
      expect(useWalletConnection().account.waitForTransaction).toHaveBeenCalledWith(mockTransactionHash);

      expect(result).toEqual({
        transactionHash: mockTransactionHash,
        contractAddress: mockContractAddress,
      });
    });

    it('should handle deployment errors correctly', async () => {
      const mockError = new Error('Deployment failed');
      useWalletConnection().account.deployContract.mockRejectedValue(mockError);

      const { deploycontract } = useContractDeployment();

      await expect(deploycontract(mockWalletId)).rejects.toThrow('Deployment failed');
    });

    it('should handle transaction waiting errors', async () => {
      const mockError = new Error('Transaction failed');
      useWalletConnection().account.waitForTransaction.mockRejectedValue(mockError);

      const { deploycontract } = useContractDeployment();

      await expect(deploycontract(mockWalletId)).rejects.toThrow('Transaction failed');
    });
  });

  describe('checkAndDeployContract', () => {
    it('should deploy contract if not already deployed', async () => {
      axiosInstance.get.mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      const { checkAndDeployContract } = useContractDeployment();

      await checkAndDeployContract(mockWalletId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/api/check-user?wallet_id=${mockWalletId}`);
      expect(useWalletConnection).toHaveBeenCalled();
      expect(useWalletConnection().account.deployContract).toHaveBeenCalledWith({
        contractData: 'mockContractData',
      });
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/update-user-contract', {
        wallet_id: mockWalletId,
        contract_address: mockContractAddress,
      });
    });

    it('should skip deployment if contract already exists', async () => {
      axiosInstance.get.mockResolvedValue({
        data: { is_contract_deployed: true },
      });

      await useContractDeployment().checkAndDeployContract(mockWalletId);

      expect(axiosInstance.get).toHaveBeenCalled();
      expect(useWalletConnection).toHaveBeenCalled();
      expect(axiosInstance.post).not.toHaveBeenCalled();
    });

    it('should handle backend check errors correctly', async () => {
      const mockError = new Error('Backend error');
      axiosInstance.get.mockRejectedValue(mockError);

      console.error = jest.fn();

      await useContractDeployment().checkAndDeployContract(mockWalletId);

      expect(console.error).toHaveBeenCalledWith('Error checking contract status:', mockError);
    });
  });
});
