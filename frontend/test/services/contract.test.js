import { connect } from 'starknetkit';
import { axiosInstance } from '../../src/utils/axios';
import { deployContract, checkAndDeployContract } from '../../src/services/contract';
import { getDeployContractData } from '../../src/utils/constants';

jest.mock('starknetkit', () => ({
  connect: jest.fn(),
}));
jest.mock(
  'starknetkit/injected',
  () => ({
    InjectedConnector: jest.fn(),
  }),
  { virtual: true }
);

jest.mock('../../src/utils/axios');
jest.mock('../../src/utils/constants');

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
      jest.setTimeout(10000);
      const mockStarknet = {
        wallet: {
          isConnected: true,
          account: {
            deployContract: jest.fn().mockResolvedValue({
              transaction_hash: mockTransactionHash,
              contract_address: mockContractAddress,
            }),
            waitForTransaction: jest.fn().mockResolvedValue(true),
          },
          enable: jest.fn(),
        },
      };
      connect.mockResolvedValue(mockStarknet);

      const result = await deployContract(mockWalletId);

      expect(connect).toHaveBeenCalled();
      expect(mockStarknet.wallet.account.deployContract).toHaveBeenCalledWith({
        contractData: 'mockContractData',
      });
      expect(mockStarknet.wallet.account.waitForTransaction).toHaveBeenCalledWith(mockTransactionHash);

      expect(result).toEqual({
        transactionHash: mockTransactionHash,
        contractAddress: mockContractAddress,
      });
    });

    it('should throw error if wallet is not connected', async () => {
      const mockStarknet = {
        wallet: {
          isConnected: false,
          enable: jest.fn(),
        },
      };
      connect.mockResolvedValue(mockStarknet);

      await expect(deployContract(mockWalletId)).rejects.toThrow('Wallet not connected');
    });

    it('should handle deployment errors correctly', async () => {
      const mockError = new Error('Deployment failed');
      connect.mockRejectedValue(mockError);

      await expect(deployContract(mockWalletId)).rejects.toThrow('Deployment failed');
    });
  });

  describe('checkAndDeployContract', () => {
    it('should deploy contract if not already deployed', async () => {
      axiosInstance.get.mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      const mockStarknet = {
        wallet: {
          isConnected: true,
          account: {
            deployContract: jest.fn().mockResolvedValue({
              transaction_hash: mockTransactionHash,
              contract_address: mockContractAddress,
            }),
            waitForTransaction: jest.fn().mockResolvedValue(true),
          },
          enable: jest.fn(),
        },
      };
      connect.mockResolvedValue(mockStarknet);

      axiosInstance.post.mockResolvedValue({ data: 'success' });

      await checkAndDeployContract(mockWalletId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/api/check-user?wallet_id=${mockWalletId}`);
      expect(connect).toHaveBeenCalled();
      expect(mockStarknet.wallet.account.deployContract).toHaveBeenCalledWith({
        contractData: 'mockContractData',
      });
      expect(axiosInstance.post).toHaveBeenCalledWith(`/api/update-user-contract`, {
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
      expect(connect).not.toHaveBeenCalled();
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
      axiosInstance.get.mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      const mockStarknet = {
        wallet: {
          isConnected: true,
          account: {
            deployContract: jest.fn().mockResolvedValue({
              transaction_hash: mockTransactionHash,
              contract_address: mockContractAddress,
            }),
            waitForTransaction: jest.fn().mockResolvedValue(true),
          },
          enable: jest.fn(),
        },
      };
      connect.mockResolvedValue(mockStarknet);

      const mockUpdateError = new Error('Update failed');
      axiosInstance.post.mockRejectedValue(mockUpdateError);

      console.error = jest.fn();

      await checkAndDeployContract(mockWalletId);

      expect(console.error).toHaveBeenCalledWith('Error checking contract status:', mockUpdateError);
    });
  });
});
