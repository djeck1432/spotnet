//contract.test.js
import { connect } from 'starknetkit';
import { getWallet } from '../../src/services/wallet';
import { axiosInstance } from '../../src/utils/axios';
import { deployContract, checkAndDeployContract } from '../../src/services/contract';
import { getDeployContractData } from '../../src/utils/constants';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('starknetkit', () => ({
  connect: vi.fn(),
}));
vi.mock('../../src/services/wallet', () => ({
  getWallet: vi.fn(),
}));
vi.mock('../../src/utils/axios');
vi.mock('../../src/utils/constants');
vi.mock('../../src/components/layout/notifier/Notifier', () => ({
  notify: vi.fn(),
  ToastWithLink: vi.fn(),
}));

describe('Contract Deployment Tests', () => {
  const mockWalletId = '0x123...';
  const mockTransactionHash = '0xabc...';
  const mockContractAddress = '0xdef...';

  // Common mock wallet setup
  const createMockWallet = (overrides = {}) => ({
    account: {
      deployContract: vi.fn().mockResolvedValue({
        transaction_hash: mockTransactionHash,
        contract_address: mockContractAddress,
      }),
      waitForTransaction: vi.fn().mockResolvedValue(true),
      ...overrides,
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    getDeployContractData.mockReturnValue({
      contractData: 'mockContractData',
    });
    vi.mocked(axiosInstance.get).mockReset();
    vi.mocked(axiosInstance.post).mockReset();
  });

  describe('deployContract', () => {
    it('should successfully deploy contract', async () => {
      const mockWallet = createMockWallet();
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
      const mockWallet = createMockWallet({
        waitForTransaction: vi.fn().mockRejectedValue(new Error('Transaction failed')),
      });
      getWallet.mockResolvedValue(mockWallet);
      await expect(deployContract(mockWalletId)).rejects.toThrow('Transaction failed');
    });
  });

  describe('checkAndDeployContract', () => {
    it('should deploy contract if not already deployed', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      const mockWallet = createMockWallet();
      getWallet.mockResolvedValue(mockWallet);
      vi.mocked(axiosInstance.post).mockResolvedValue({ data: 'success' });

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
      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: { is_contract_deployed: true },
      });
      await checkAndDeployContract(mockWalletId);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/api/check-user?wallet_id=${mockWalletId}`);
      expect(getWallet).not.toHaveBeenCalled();
      expect(axiosInstance.post).not.toHaveBeenCalled();
    });

    it('should handle backend check errors correctly', async () => {
      const mockError = new Error('Backend error');
      vi.mocked(axiosInstance.get).mockRejectedValue(mockError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await checkAndDeployContract(mockWalletId);

      expect(consoleSpy).toHaveBeenCalledWith('Error checking contract status:', mockError);
      consoleSpy.mockRestore();
    });

    it('should handle contract update error correctly after deployment', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue({
        data: { is_contract_deployed: false },
      });
      const mockWallet = createMockWallet();
      getWallet.mockResolvedValue(mockWallet);
      const mockUpdateError = new Error('Update failed');
      vi.mocked(axiosInstance.post).mockRejectedValue(mockUpdateError);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await checkAndDeployContract(mockWalletId);

      expect(consoleSpy).toHaveBeenCalledWith('Error checking contract status:', mockUpdateError);
      consoleSpy.mockRestore();
    });
  });
});
