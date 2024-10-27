import { connect } from "get-starknet";
import axios from "axios";
import {
  deployContract,
  checkAndDeployContract,
} from "../../src/services/contract";
import { getDeployContractData } from "../../src/services/constants";
import { mockBackendUrl } from "../constants";

jest.mock("get-starknet");
jest.mock("axios");
jest.mock("../../src/services/constants");

describe("Contract Deployment Tests", () => {
  const mockWalletId = "0x123...";
  const mockTransactionHash = "0xabc...";
  const mockContractAddress = "0xdef...";

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.REACT_APP_BACKEND_URL = mockBackendUrl;

    getDeployContractData.mockReturnValue({
      contractData: "mockContractData",
    });
  });

  describe("deployContract", () => {
    it("should successfully deploy contract", async () => {
      jest.setTimeout(10000);
      const mockStarknet = {
        isConnected: true,
        account: {
          deployContract: jest.fn().mockResolvedValue({
            transaction_hash: mockTransactionHash,
            contract_address: mockContractAddress,
          }),
          waitForTransaction: jest.fn().mockResolvedValue(true),
        },
      };
      connect.mockResolvedValue(mockStarknet);

      const result = await deployContract(mockWalletId);

      expect(connect).toHaveBeenCalled();
      expect(mockStarknet.account.deployContract).toHaveBeenCalledWith({
        contractData: "mockContractData",
      });
      expect(mockStarknet.account.waitForTransaction).toHaveBeenCalledWith(
        mockTransactionHash
      );

      expect(result).toEqual({
        transactionHash: mockTransactionHash,
        contractAddress: mockContractAddress,
      });
    });

    it("should throw error if wallet is not connected", async () => {
      const mockStarknet = {
        isConnected: false,
      };
      connect.mockResolvedValue(mockStarknet);

      await expect(deployContract(mockWalletId)).rejects.toThrow(
        "Wallet not connected"
      );
    });

    it("should handle deployment errors correctly", async () => {
      const mockError = new Error("Deployment failed");
      connect.mockRejectedValue(mockError);

      await expect(deployContract(mockWalletId)).rejects.toThrow(
        "Deployment failed"
      );
    });
  });

  describe("checkAndDeployContract", () => {
    it("should deploy contract if not already deployed", async () => {
      axios.get.mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      const mockStarknet = {
        isConnected: true,
        account: {
          deployContract: jest.fn().mockResolvedValue({
            transaction_hash: mockTransactionHash,
            contract_address: mockContractAddress,
          }),
          waitForTransaction: jest.fn().mockResolvedValue(true),
        },
      };
      connect.mockResolvedValue(mockStarknet);

      axios.post.mockResolvedValue({ data: "success" });

      await checkAndDeployContract(mockWalletId);

      expect(axios.get).toHaveBeenCalledWith(
        `${mockBackendUrl}/api/check-user?wallet_id=${mockWalletId}`
      );
      expect(connect).toHaveBeenCalled();
      expect(mockStarknet.account.deployContract).toHaveBeenCalledWith({
        contractData: "mockContractData",
      });
      expect(axios.post).toHaveBeenCalledWith(
        `${mockBackendUrl}/api/update-user-contract`,
        { wallet_id: mockWalletId, contract_address: mockContractAddress }
      );
    });

    it("should skip deployment if contract already exists", async () => {
      axios.get.mockResolvedValue({
        data: { is_contract_deployed: true },
      });

      await checkAndDeployContract(mockWalletId);

      expect(axios.get).toHaveBeenCalled();
      expect(connect).not.toHaveBeenCalled();
      expect(axios.post).not.toHaveBeenCalled();
    });

    it("should handle backend check errors correctly", async () => {
      const mockError = new Error("Backend error");
      axios.get.mockRejectedValue(mockError);

      console.error = jest.fn();

      await checkAndDeployContract(mockWalletId);

      expect(console.error).toHaveBeenCalledWith(
        "Error checking contract status:",
        mockError
      );
    });

    it("should handle contract update error correctly after deployment", async () => {
      axios.get.mockResolvedValue({
        data: { is_contract_deployed: false },
      });

      const mockStarknet = {
        isConnected: true,
        account: {
          deployContract: jest.fn().mockResolvedValue({
            transaction_hash: mockTransactionHash,
            contract_address: mockContractAddress,
          }),
          waitForTransaction: jest.fn().mockResolvedValue(true),
        },
      };
      connect.mockResolvedValue(mockStarknet);

      const mockUpdateError = new Error("Update failed");
      axios.post.mockRejectedValue(mockUpdateError);

      console.error = jest.fn();

      await checkAndDeployContract(mockWalletId);

      expect(console.error).toHaveBeenCalledWith(
        "Error checking contract status:",
        mockUpdateError
      );
    });
  });
});
