import { useTransaction } from '../../src/services/transaction';
import { axiosInstance } from '../../src/utils/axios';
import { checkAndDeployContract } from '../../src/services/contract';
import { notify, ToastWithLink } from '../../src/components/layout/notifier/Notifier';

// Mocks
jest.mock('../../src/utils/axios');
jest.mock('starknetkit', () => ({
  disconnect: jest.fn(),
  useStarknetkitConnectModal: jest.fn()
}));
jest.mock('../../src/services/contract');
jest.mock('../../src/components/layout/notifier/Notifier', () => ({
  notify: jest.fn(),
  ToastWithLink: jest.fn(() => 'mocked-toast')
}));

jest.mock('../../src/stores/useWalletStore', () => ({
  useAccountStore: jest.fn()
}));

jest.mock('@starknet-react/core', () => ({
  useConnect: jest.fn(() => ({
    connect: jest.fn(),
    connectors: []
  })),
  useAccount: jest.fn(() => ({
    address: '0x123',
    isConnected: true
  }))
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

describe('useTransaction', () => {
  const mockTransactionHash = '0xabc123';
  const mockContractAddress = '0xdef456';
  const mockWalletId = '0x789xyz';
  
  const mockAccount = {
    execute: jest.fn().mockResolvedValue({
      transaction_hash: mockTransactionHash
    }),
    provider: {
      getTransactionReceipt: jest.fn().mockResolvedValue({
        status: 'ACCEPTED'
      })
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    require('../../src/stores/useWalletStore').useAccountStore.mockReturnValue({
      account: mockAccount
    });
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
      const { sendTransaction } = useTransaction();
      
      const result = await sendTransaction(validLoopLiquidityData, mockContractAddress);

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
      
      expect(ToastWithLink).toHaveBeenCalledWith(
        'Transaction successfully sent',
        `https://starkscan.co/tx/${mockTransactionHash}`,
        'Transaction ID'
      );
      expect(notify).toHaveBeenCalledWith('mocked-toast', 'success');
      expect(result).toEqual({
        loopTransaction: mockTransactionHash,
      });
    });

    it('should throw error if loop_liquidity_data is invalid', async () => {
      const { sendTransaction } = useTransaction();
      const invalidData = { deposit_data: { token: '0x456' } };

      await expect(sendTransaction(invalidData, mockContractAddress))
        .rejects.toThrow('Missing or invalid loop_liquidity_data fields');
    });
  });

  describe('sendWithdrawAllTransaction', () => {
    const mockWithdrawData = {
      repay_data: { amount: '1000' },
      tokens: ['0x123', '0x456']
    };

    it('should successfully send withdraw all transaction', async () => {
      const { sendWithdrawAllTransaction } = useTransaction();

      const result = await sendWithdrawAllTransaction(mockWithdrawData, mockContractAddress);

      expect(mockAccount.execute).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            contractAddress: mockContractAddress,
            entrypoint: 'close_position',
          }),
          expect.objectContaining({
            contractAddress: mockContractAddress,
            entrypoint: 'withdraw',
          })
        ])
      );

      expect(ToastWithLink).toHaveBeenCalledWith(
        'Withdraw all successfully sent',
        `https://starkscan.co/tx/${mockTransactionHash}`,
        'Transaction ID'
      );
      expect(notify).toHaveBeenCalledWith('mocked-toast', 'success');
      expect(result).toEqual({
        transaction_hash: mockTransactionHash,
      });
    });
  });

  describe('sendExtraDepositTransaction', () => {
    const mockDepositData = {
      token_address: '0x123',
      token_amount: '1000'
    };

    it('should successfully send extra deposit transaction', async () => {
      const { sendExtraDepositTransaction } = useTransaction();

      const result = await sendExtraDepositTransaction(mockDepositData, mockContractAddress);

      expect(mockAccount.execute).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            contractAddress: mockDepositData.token_address,
            entrypoint: 'approve',
          }),
          expect.objectContaining({
            contractAddress: mockContractAddress,
            entrypoint: 'extra_deposit',
          })
        ])
      );

      expect(ToastWithLink).toHaveBeenCalledWith(
        'Extra Deposit Transaction successfully sent',
        `https://starkscan.co/tx/${mockTransactionHash}`,
        'Transaction ID'
      );
      expect(notify).toHaveBeenCalledWith('mocked-toast', 'success');
      expect(result).toEqual({
        transaction_hash: mockTransactionHash,
      });
    });
  });

  describe('closePosition', () => {
    const mockTransactionData = {
      contract_address: mockContractAddress,
      position_id: 1,
    };

    it('should successfully close a position', async () => {
      const { closePosition } = useTransaction();

      const result = await closePosition(mockTransactionData);

      expect(mockAccount.execute).toHaveBeenCalledWith([
        expect.objectContaining({
          contractAddress: mockContractAddress,
          entrypoint: 'close_position',
        }),
      ]);

      expect(ToastWithLink).toHaveBeenCalledWith(
        'Close position successfully sent',
        `https://starkscan.co/tx/${mockTransactionHash}`,
        'Transaction ID'
      );
      expect(notify).toHaveBeenCalledWith('mocked-toast', 'success');
      expect(result).toEqual({ transaction_hash: mockTransactionHash });
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
      axiosInstance.post.mockResolvedValue({ data: mockTransactionData });
      axiosInstance.get.mockResolvedValue({ data: { status: 'open' } });
      checkAndDeployContract.mockResolvedValue();
    });

    it('should handle successful transaction flow', async () => {
      const { handleTransaction } = useTransaction();

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetTokenAmount,
        mockSetLoading
      );

      expect(mockSetLoading).toHaveBeenNthCalledWith(1, true);
      expect(checkAndDeployContract).toHaveBeenCalledWith(mockWalletId);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/create-position', mockFormData);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/open-position', {
        params: {
          position_id: mockTransactionData.position_id,
          transaction_hash: mockTransactionHash
        }
      });
      expect(mockSetTokenAmount).toHaveBeenCalledWith('');
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
    });

    it('should handle contract deployment error', async () => {
      checkAndDeployContract.mockRejectedValue(new Error('Contract deployment failed'));
      const { handleTransaction } = useTransaction();

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetTokenAmount,
        mockSetLoading
      );

      expect(notify).toHaveBeenCalledWith('Error deploying contract. Please try again.', 'error');
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
      expect(mockSetTokenAmount).not.toHaveBeenCalled();
    });

    it('should handle transaction error', async () => {
      axiosInstance.post.mockRejectedValue(new Error('Transaction failed'));
      const { handleTransaction } = useTransaction();

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetTokenAmount,
        mockSetLoading
      );

      expect(notify).toHaveBeenCalledWith('Error sending transaction: Error: Transaction failed', 'error');
      expect(mockSetLoading).toHaveBeenLastCalledWith(false);
      expect(mockSetTokenAmount).not.toHaveBeenCalled();
    });
  });
});