import { getWallet } from '../../src/services/wallet';
import { sendTransaction, closePosition, handleTransaction } from '../../src/services/transaction';
import { axiosInstance } from '../../src/utils/axios';
import { mockBackendUrl } from '../constants';
import { checkAndDeployContract } from '../../src/services/contract';

jest.mock('../../src/services/wallet', () => ({
  getWallet: jest.fn(),
}));

jest.mock('../../src/utils/axios');
jest.mock('../../src/services/contract');

jest.mock('starknet', () => ({
  CallData: class MockCallData {
    constructor() {
      return {
        compile: jest.fn((fnName, args) => {
          return Array.isArray(args) ? args : [args];
        }),
      };
    }
  },
}));

describe('Transaction Functions', () => {
  const mockTransactionHash = '0xabc123';
  const mockContractAddress = '0xdef456';
  const mockWalletId = '0x789xyz';

  beforeEach(() => {
    jest.clearAllMocks();

    const mockWallet = {
      account: {
        execute: jest.fn().mockResolvedValue({
          transaction_hash: mockTransactionHash,
        }),
      },
      provider: {
        getTransactionReceipt: jest.fn().mockResolvedValue({
          status: 'ACCEPTED',
        }),
      },
    };

    getWallet.mockResolvedValue(mockWallet);

    process.env.VITE_APP_BACKEND_URL = mockBackendUrl;
  });

  afterEach(() => {
    delete process.env.VITE_APP_BACKEND_URL;
  });

  describe('sendTransaction', () => {
    const validLoopLiquidityData = {
      pool_key: '0x123',
      deposit_data: {
        token: '0x456',
        amount: '1000',
      },
    };

    it('should successfully send a transaction', async () => {
      const result = await sendTransaction(validLoopLiquidityData, mockContractAddress);

      expect(getWallet).toHaveBeenCalled();
      const mockWallet = await getWallet();
      expect(mockWallet.account.execute).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            contractAddress: validLoopLiquidityData.deposit_data.token,
            entrypoint: 'approve',
          }),
          expect.objectContaining({
            contractAddress: mockContractAddress,
            entrypoint: 'loop_liquidity',
          }),
        ])
      );
      expect(result).toEqual({
        loopTransaction: mockTransactionHash,
      });
    });

    it('should throw error if loop_liquidity_data is invalid', async () => {
      const invalidData = { deposit_data: { token: '0x456' } };

      await expect(sendTransaction(invalidData, mockContractAddress)).rejects.toThrow(
        'Missing or invalid loop_liquidity_data fields'
      );
    });

    it('should handle transaction errors correctly', async () => {
      const mockError = new Error('Transaction failed');
      const mockWallet = {
        account: {
          execute: jest.fn().mockRejectedValue(mockError),
        },
      };
      getWallet.mockResolvedValue(mockWallet);

      console.error = jest.fn();

      await expect(sendTransaction(validLoopLiquidityData, mockContractAddress)).rejects.toThrow('Transaction failed');

      expect(console.error).toHaveBeenCalledWith('Error sending transaction:', expect.any(Error));
    });
  });

  describe('closePosition', () => {
    const mockTransactionData = {
      contract_address: mockContractAddress,
      position_id: 1,
    };

    it('should successfully close a position', async () => {
      const result = await closePosition(mockTransactionData);

      expect(getWallet).toHaveBeenCalled();
      const mockWallet = await getWallet();
      expect(mockWallet.account.execute).toHaveBeenCalledWith([
        expect.objectContaining({
          contractAddress: mockContractAddress,
          entrypoint: 'close_position',
        }),
      ]);
      expect(result).toEqual({ transaction_hash: mockTransactionHash });
    });

    it('should handle close position errors', async () => {
      const mockError = new Error('Close position failed');
      const mockWallet = {
        account: {
          execute: jest.fn().mockRejectedValue(mockError),
        },
      };
      getWallet.mockResolvedValue(mockWallet);

      await expect(closePosition(mockTransactionData)).rejects.toThrow('Close position failed');
    });
  });

  describe('handleTransaction', () => {
    const mockSetTokenAmount = jest.fn();
    const mockSetLoading = jest.fn();
    const mockFormData = { position_id: 1 };
    const mockTransactionData = {
      position_id: 1,
      contract_address: mockContractAddress,
      pool_key: '0x123',
      deposit_data: {
        token: '0x456',
        amount: '1000',
      },
    };

    beforeEach(() => {
      mockSetTokenAmount.mockClear();
      mockSetLoading.mockClear();
      axiosInstance.post.mockResolvedValue({ data: mockTransactionData });
      checkAndDeployContract.mockResolvedValue();
    });

    it('should handle successful transaction flow', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: { status: 'open' },
      });

      await handleTransaction(mockWalletId, mockFormData, mockSetTokenAmount, mockSetLoading);

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(checkAndDeployContract).toHaveBeenCalledWith(mockWalletId);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/create-position', mockFormData);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/open-position', {
        params: { position_id: mockTransactionData.position_id, transaction_hash: mockTransactionHash },
      });
      expect(mockSetTokenAmount).toHaveBeenCalledWith('');
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('should handle contract deployment error', async () => {
      const mockError = new Error('Contract deployment failed');
      checkAndDeployContract.mockRejectedValue(mockError);

      console.error = jest.fn();

      await handleTransaction(mockWalletId, mockFormData, mockSetTokenAmount, mockSetLoading);

      expect(console.error).toHaveBeenCalledWith('Error deploying contract:', mockError);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it('should handle create position error', async () => {
      const mockError = new Error('Create position failed');
      axiosInstance.post.mockRejectedValue(mockError);

      console.error = jest.fn();

      await handleTransaction(mockWalletId, mockFormData, mockSetTokenAmount, mockSetLoading);

      expect(console.error).toHaveBeenCalledWith('Failed to create position:', mockError);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });
});
