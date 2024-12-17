import { connect } from 'starknetkit';
import { sendTransaction, closePosition, handleTransaction } from '../../src/services/transaction';
import { axiosInstance } from '../../src/utils/axios';
import { checkAndDeployContract } from '../../src/services/contract';

jest.mock('starknetkit');
jest.mock('../../src/utils/axios');
jest.mock('../../src/services/contract');

jest.mock('starknet', () => ({
  CallData: class MockCallData {
    compile(fnName, args) {
      return Array.isArray(args) ? args : [args];
    }
  },
}));

describe('Transaction Functions', () => {
  const mockTransactionHash = '0xabc123';
  const mockContractAddress = '0xdef456';
  const mockWalletId = '0x789xyz';

  beforeEach(() => {
    jest.clearAllMocks();

    const mockStarknet = {
      isConnected: true,
      account: {
        execute: jest.fn().mockResolvedValue({
          transaction_hash: mockTransactionHash,
        }),
      },
    };

    connect.mockResolvedValue(mockStarknet);
  });

  describe('handleTransaction', () => {
    const mockSetError = jest.fn();
    const mockSetTokenAmount = jest.fn();
    const mockSetLoading = jest.fn();
    const mockSetSuccessful = jest.fn();
    const mockFormData = { position_id: 1 };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle successful transaction flow', async () => {
      const mockTransactionData = {
        position_id: 1,
        contract_address: mockContractAddress,
        pool_key: '0x123',
        deposit_data: {
          token: '0x456',
          amount: '1000',
        },
      };

      // Mock external calls
      checkAndDeployContract.mockResolvedValueOnce();
      axiosInstance.post.mockResolvedValueOnce({ data: mockTransactionData });
      axiosInstance.get.mockResolvedValueOnce({
        data: { status: 'open' },
      });

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetError,
        mockSetTokenAmount,
        mockSetLoading,
        mockSetSuccessful
      );

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(checkAndDeployContract).toHaveBeenCalledWith(mockWalletId);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/create-position', mockFormData);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/open-position', {
        params: { position_id: mockTransactionData.position_id },
      });
      expect(mockSetTokenAmount).toHaveBeenCalledWith('');
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetError).toHaveBeenCalledWith('');
      expect(mockSetSuccessful).not.toHaveBeenCalledWith(false);
    });

    it('should handle errors during deployment', async () => {
      const mockError = new Error('Deployment failed');

      checkAndDeployContract.mockRejectedValueOnce(mockError);

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetError,
        mockSetTokenAmount,
        mockSetLoading,
        mockSetSuccessful
      );

      expect(mockSetError).toHaveBeenCalledWith('Error deploying contract. Please try again.');
      expect(mockSetSuccessful).toHaveBeenCalledWith(false);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('should handle create position error', async () => {
      const mockError = new Error('Create position failed');

      checkAndDeployContract.mockResolvedValueOnce();
      axiosInstance.post.mockRejectedValueOnce(mockError);

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetError,
        mockSetTokenAmount,
        mockSetLoading,
        mockSetSuccessful
      );

      expect(mockSetError).toHaveBeenCalledWith('Failed to create position. Please try again.');
      expect(mockSetSuccessful).toHaveBeenCalledWith(false);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });
});
