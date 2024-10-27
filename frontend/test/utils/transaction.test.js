import { connect } from "get-starknet";
import {
  sendTransaction,
  closePosition,
  handleTransaction,
} from "../../src/services/transaction";
import axios from "axios";
import { mockBackendUrl } from "../constants";

jest.mock("get-starknet");
jest.mock("axios");

jest.mock("starknet", () => ({
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

describe("Transaction Functions", () => {
  const mockTransactionHash = "0xabc123";
  const mockContractAddress = "0xdef456";
  const mockWalletId = "0x789xyz";

  beforeEach(() => {
    jest.clearAllMocks();

    const mockStarknet = {
      isConnected: true,
      account: {
        execute: jest.fn().mockResolvedValue({
          transaction_hash: mockTransactionHash,
        }),
      },
      provider: {
        getTransactionReceipt: jest.fn().mockResolvedValue({
          status: "ACCEPTED",
        }),
      },
    };

    connect.mockResolvedValue(mockStarknet);

    process.env.REACT_APP_BACKEND_URL = mockBackendUrl;
  });

  afterEach(() => {
    delete process.env.REACT_APP_BACKEND_URL;
  });

  describe("sendTransaction", () => {
    const validLoopLiquidityData = {
      pool_key: "0x123",
      deposit_data: {
        token: "0x456",
        amount: "1000",
      },
    };

    it("should successfully send a transaction", async () => {
      const result = await sendTransaction(
        validLoopLiquidityData,
        mockContractAddress
      );

      expect(connect).toHaveBeenCalled();
      expect(result).toEqual({
        loopTransaction: mockTransactionHash,
      });
    });

    it("should throw error if wallet is not connected", async () => {
      connect.mockResolvedValueOnce({ isConnected: false });

      await expect(
        sendTransaction(validLoopLiquidityData, mockContractAddress)
      ).rejects.toThrow("Wallet not connected");
    });

    it("should throw error if loop_liquidity_data is invalid", async () => {
      const invalidData = { deposit_data: { token: "0x456" } };

      await expect(
        sendTransaction(invalidData, mockContractAddress)
      ).rejects.toThrow("Missing or invalid loop_liquidity_data fields");
    });

    it("should handle transaction errors correctly", async () => {
      const mockError = new Error("Transaction failed");
      connect.mockResolvedValueOnce({
        isConnected: true,
        account: {
          execute: jest.fn().mockRejectedValue(mockError),
        },
      });

      console.error = jest.fn();

      await expect(
        sendTransaction(validLoopLiquidityData, mockContractAddress)
      ).rejects.toThrow("Transaction failed");

      expect(console.error).toHaveBeenCalledWith(
        "Error sending transaction:",
        expect.any(Error)
      );
    });
  });

  describe("closePosition", () => {
    const mockTransactionData = {
      contract_address: mockContractAddress,
      position_id: 1,
    };

    it("should successfully close a position", async () => {
      await closePosition(mockTransactionData);

      expect(connect).toHaveBeenCalled();
      const mockStarknet = await connect();
      expect(mockStarknet.account.execute).toHaveBeenCalledWith([
        expect.objectContaining({
          contractAddress: mockContractAddress,
          entrypoint: "close_position",
        }),
      ]);
    });

    it("should handle close position errors", async () => {
      const mockError = new Error("Close position failed");
      connect.mockResolvedValueOnce({
        isConnected: true,
        account: {
          execute: jest.fn().mockRejectedValue(mockError),
        },
      });

      await expect(closePosition(mockTransactionData)).rejects.toThrow(
        "Close position failed"
      );
    });
  });

  describe("handleTransaction", () => {
    const mockSetError = jest.fn();
    const mockSetTokenAmount = jest.fn();
    const mockSetLoading = jest.fn();
    const mockFormData = { position_id: 1 };

    beforeEach(() => {
      mockSetError.mockClear();
      mockSetTokenAmount.mockClear();
      mockSetLoading.mockClear();
    });

    it("should handle successful transaction flow", async () => {
      const mockTransactionData = {
        position_id: 1,
        contract_address: mockContractAddress,
        pool_key: "0x123",
        deposit_data: {
          token: "0x456",
          amount: "1000",
        },
      };

      axios.post.mockResolvedValueOnce({ data: mockTransactionData });
      axios.get.mockResolvedValueOnce({
        data: { status: "open" },
      });

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetError,
        mockSetTokenAmount,
        mockSetLoading
      );

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(axios.post).toHaveBeenCalledWith(
        "http://0.0.0.0:8000/api/create-position",
        mockFormData
      );
      expect(axios.get).toHaveBeenCalledWith(
        "http://0.0.0.0:8000/api/open-position",
        { params: { position_id: mockTransactionData.position_id } }
      );
      expect(mockSetTokenAmount).toHaveBeenCalledWith("");
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetError).toHaveBeenCalledWith("");
    });

    it("should handle create position error", async () => {
      const mockError = new Error("Create position failed");
      axios.post.mockRejectedValueOnce(mockError);

      console.error = jest.fn();

      await handleTransaction(
        mockWalletId,
        mockFormData,
        mockSetError,
        mockSetTokenAmount,
        mockSetLoading
      );

      expect(mockSetError).toHaveBeenCalledWith(
        "Failed to create position. Please try again."
      );
      expect(console.error).toHaveBeenCalledWith(
        "Failed to create position:",
        mockError
      );
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });
});
