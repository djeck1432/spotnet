import { connect } from 'starknetkit';
import { getWallet } from '../../src/services/wallet';
import { axiosInstance } from '../../src/utils/axios';
import { deployContract, checkAndDeployContract } from '../../src/services/contract';
import { getDeployContractData } from '../../src/utils/constants';

// Mock dependencies
jest.mock('starknetkit', () => ({
  connect: jest.fn(),
}));
jest.mock('../../src/services/wallet', () => ({
  getWallet: jest.fn(),
}));
jest.mock('../../src/utils/axios');
jest.mock('../../src/utils/constants');
jest.mock('../../src/components/layout/notifier/Notifier', () => ({
  notify: jest.fn(),
  ToastWithLink: jest.fn(),
}));

describe('Contract Deployment Tests', () => {
  const mockWalletId = '0x123...';
  const mockTransactionHash = '0xabc...';
  const mockContractAddress = '0xdef...';

  beforeEach(() => {
    jest.clearAllMocks();

    getDeployContractData.mockReturnValue({
      contractData: 'mockContractData',
    });
  });

  describe('deployContract', () => {
    it('should successfully deploy contract', async () => {
      const mockWallet = {
        account: {
          deployContract: jest.fn().mockResolvedValue({
            transaction_hash: mockTransactionHash,
            contract_address: mockContractAddress,
          }),
          waitForTransaction: jest.fn().mockResolvedValue(true),
        },
      };

      getWallet.mockResolvedValue(mockWallet);

      const result = await deployContract(mockWalletId);

      expect(getWallet).toHaveBeenCalled();
      expect(mockWallet.account.deployContract).toHaveBeenCalledWith({
        contractData: 'mockContractData',
      });
      expect(mockWallet.account.waitForTransaction).toHaveBeenCalledWith(mockTransactionHash);

      expect(result).toEqual({
        transactionHash: mockTransactionHash,
        contractAddress: mockContractAddress,
      });
    });

    it('should handle deployment errors correctly', async () => {
      const mockError = new Error('Deployment failed');
      getWallet.mockRejectedValue(mockError);

      await expect(deployContract(mockWalletId)).rejects.toThrow('Deployment failed');
    });

    it('should handle transaction waiting errors', async () => {
      const mockWallet = {
        account: {
          deployContract: jest.fn().mockResolvedValue({
            transaction_hash: mockTransactionHash,
            contract_address: mockContractAddress,
          }),
          waitForTransaction: jest.fn().mockRejectedValue(new Error('Transaction failed')),
        },
      };

      getWallet.mockResolvedValue(mockWallet);

      await expect(deployContract(mockWalletId)).rejects.toThrow('Transaction failed');
    });
  });

  describe('checkAndDeployContract', () => {
    it('should deploy contract if not already deployed', async () => {
      // Mock the API check for undeployed contract
      axiosInstance.get.mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      // Mock successful wallet and deployment
      const mockWallet = {
        account: {
          deployContract: jest.fn().mockResolvedValue({
            transaction_hash: mockTransactionHash,
            contract_address: mockContractAddress,
          }),
          waitForTransaction: jest.fn().mockResolvedValue(true),
        },
      };

      getWallet.mockResolvedValue(mockWallet);
      axiosInstance.post.mockResolvedValue({ data: 'success' });

      await checkAndDeployContract(mockWalletId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/api/check-user?wallet_id=${mockWalletId}`);
      expect(getWallet).toHaveBeenCalled();
      expect(mockWallet.account.deployContract).toHaveBeenCalledWith({
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

      await checkAndDeployContract(mockWalletId);

      expect(axiosInstance.get).toHaveBeenCalled();
      expect(getWallet).not.toHaveBeenCalled();
      expect(axiosInstance.post).not.toHaveBeenCalled();
    });

    it('should handle backend check errors correctly', async () => {
      const mockError = new Error('Backend error');
      axiosInstance.get.mockRejectedValue(mockError);

      console.error = jest.fn();

      await checkAndDeployContract(mockWalletId);

      expect(console.error).toHaveBeenCalledWith('Error checking contract status:', mockError);
    });

    it('should handle contract update error correctly after deployment', async () => {
      // Mock API check and successful deployment
      axiosInstance.get.mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      const mockWallet = {
        account: {
          deployContract: jest.fn().mockResolvedValue({
            transaction_hash: mockTransactionHash,
            contract_address: mockContractAddress,
          }),
          waitForTransaction: jest.fn().mockResolvedValue(true),
        },
      };

      getWallet.mockResolvedValue(mockWallet);

      // Mock backend update failure
      const mockUpdateError = new Error('Update failed');
      axiosInstance.post.mockRejectedValue(mockUpdateError);

      console.error = jest.fn();

      await checkAndDeployContract(mockWalletId);

      expect(console.error).toHaveBeenCalledWith('Error checking contract status:', mockUpdateError);
    });
  });
});
