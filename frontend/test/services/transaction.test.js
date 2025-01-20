import { useTransactionHandler, sendTransaction, closePosition } from '../../src/services/transaction';
import { axiosInstance } from '../../src/utils/axios';
import { useContractDeployment } from '../../src/services/contract';

jest.mock('../../src/utils/axios');
jest.mock('../../src/services/contract');
jest.mock('../../src/components/layout/notifier/Notifier', () => ({
  notify: jest.fn(),
  ToastWithLink: jest.fn()
}));

jest.mock('@starknet-react/core', () => ({
  useConnect: jest.fn(),
  useAccount: jest.fn(),
  useDisconnect: jest.fn(),
  useBalance: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

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
    require('@starknet-react/core').useConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: []
    });
    require('@starknet-react/core').useAccount.mockReturnValue({
      address: '0x123',
      isConnected: true
    });

    jest.clearAllMocks();
  });

  describe('useTransactionHandler', () => {
    let setIsLoading;

    beforeEach(() => {
      setIsLoading = jest.fn();
      require('react').useState.mockReturnValue([false, setIsLoading]);

      useContractDeployment.mockReturnValue({
        checkAndDeployContract: jest.fn().mockResolvedValue()
      });
    });

    it('should handle successful transaction flow', async () => {
      const mockAccount = {
        execute: jest.fn().mockResolvedValue({ transaction_hash: mockTransactionHash })
      };
      
      const mockSetTokenAmount = jest.fn();
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

      axiosInstance.post.mockResolvedValue({ data: mockTransactionData });
      axiosInstance.get.mockResolvedValue({
        data: { status: 'open' }
      });

      const { handleTransaction } = useTransactionHandler();

      await handleTransaction(
        mockAccount,
        mockWalletId,
        mockFormData,
        mockSetTokenAmount
      );

      expect(useContractDeployment().checkAndDeployContract)
        .toHaveBeenCalledWith(mockWalletId);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/create-position', mockFormData);
      expect(mockSetTokenAmount).toHaveBeenCalledWith('');
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });

    it('should handle contract deployment error', async () => {
      const mockError = new Error('Contract deployment failed');
      useContractDeployment().checkAndDeployContract.mockRejectedValue(mockError);

      const mockSetTokenAmount = jest.fn();
      const { handleTransaction } = useTransactionHandler();

      await handleTransaction(
        {},
        mockWalletId,
        {},
        mockSetTokenAmount
      );

      expect(setIsLoading).toHaveBeenCalledWith(false);
      expect(mockSetTokenAmount).not.toHaveBeenCalled();
    });

    it('should handle transaction error', async () => {
      const mockError = new Error('Transaction failed');
      axiosInstance.post.mockRejectedValue(mockError);

      const mockSetTokenAmount = jest.fn();
      const { handleTransaction } = useTransactionHandler();

      await handleTransaction(
        {},
        mockWalletId,
        {},
        mockSetTokenAmount
      );

      expect(setIsLoading).toHaveBeenCalledWith(false);
      expect(mockSetTokenAmount).not.toHaveBeenCalled();
    });

    it('should set loading state correctly', async () => {
      const { handleTransaction } = useTransactionHandler();
      
      await handleTransaction({}, mockWalletId, {}, jest.fn());
      
      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(setIsLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe('sendTransaction', () => {
    const mockAccount = {
      execute: jest.fn().mockResolvedValue({ transaction_hash: mockTransactionHash })
    };

    const validLoopLiquidityData = {
      pool_key: '0x123',
      deposit_data: {
        token: '0x456',
        amount: '1000',
      },
    };

    it('should successfully send a transaction', async () => {
      const result = await sendTransaction(mockAccount, validLoopLiquidityData, mockContractAddress);
      
      expect(mockAccount.execute).toHaveBeenCalledWith(
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
      await expect(sendTransaction(mockAccount, invalidData, mockContractAddress))
        .rejects.toThrow('Missing or invalid loop_liquidity_data fields');
    });
  });

  describe('closePosition', () => {
    const mockAccount = {
      execute: jest.fn().mockResolvedValue({ transaction_hash: mockTransactionHash })
    };

    const mockTransactionData = {
      contract_address: mockContractAddress,
      position_id: 1,
    };

    it('should successfully close a position', async () => {
      const result = await closePosition(mockAccount, mockTransactionData);

      expect(result).toEqual({ transaction_hash: mockTransactionHash });
    });

    it('should handle close position errors', async () => {
      const mockError = new Error('Close position failed');
      const mockWallet = {
        account: {
          execute: jest.fn().mockRejectedValue(mockError),
        },
      };

      await expect(closePosition(mockWallet.account, mockTransactionData)).rejects.toThrow('Close position failed');
    });
  });
});
