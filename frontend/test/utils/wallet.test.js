import { connect } from "get-starknet";
import {
  connectWallet,
  getTokenBalances,
  getBalances,
  logout,
} from "../../src/services/wallet";
import {
  ETH_ADDRESS,
  STRK_ADDRESS,
  USDC_ADDRESS,
} from "../../src/services/constants";

jest.mock("../assets/icons/ethereum.svg", () => ({
  ReactComponent: () => "ETH-icon",
}));
jest.mock("../assets/icons/borrow_usdc.svg", () => ({
  ReactComponent: () => "USDC-icon",
}));
jest.mock("../assets/icons/strk.svg", () => ({
  ReactComponent: () => "STRK-icon",
}));
jest.mock("../assets/icons/dai.svg", () => ({
  ReactComponent: () => "DAI-icon",
}));

jest.mock("get-starknet", () => ({
  connect: jest.fn(),
}));

describe("Wallet Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("connectWallet", () => {
    it("should successfully connect wallet and return address", async () => {
      const mockStarknet = {
        enable: jest.fn(),
        isConnected: true,
        selectedAddress: "0x123",
      };

      connect.mockResolvedValue(mockStarknet);

      const address = await connectWallet();

      expect(connect).toHaveBeenCalledWith({
        modalMode: "alwaysAsk",
        modalTheme: "light",
      });
      expect(mockStarknet.enable).toHaveBeenCalled();
      expect(address).toBe("0x123");
    });

    it("should throw error when Starknet object is not found", async () => {
      connect.mockResolvedValue(null);

      await expect(connectWallet()).rejects.toThrow(
        "Failed to connect to wallet"
      );
    });

    it("should throw error when wallet connection fails", async () => {
      const mockStarknet = {
        enable: jest.fn(),
        isConnected: false,
      };

      connect.mockResolvedValue(mockStarknet);

      await expect(connectWallet()).rejects.toThrow("Wallet connection failed");
    });
  });

  describe("getTokenBalances", () => {
    it("should fetch all token balances successfully", async () => {
      const mockStarknet = {
        isConnected: true,
        provider: {
          callContract: jest.fn().mockImplementation(({ contractAddress }) => {
            const mockBalances = {
              [ETH_ADDRESS]: { result: ["1000000000000000000"] },
              [USDC_ADDRESS]: { result: ["1000000000000000000"] },
              [STRK_ADDRESS]: { result: ["2000000000000000000"] },
            };
            return mockBalances[contractAddress];
          }),
        },
      };

      connect.mockResolvedValue(mockStarknet);

      const balances = await getTokenBalances("0x123");

      expect(balances).toEqual({
        ETH: "1.0000",
        USDC: "1.0000",
        STRK: "2.0000",
      });
    });

    it("should throw error when wallet is not connected", async () => {
      const mockStarknet = { isConnected: false };

      connect.mockResolvedValue(mockStarknet);

      await expect(getTokenBalances("0x123")).rejects.toThrow(
        "Wallet not connected"
      );
    });
  });

  describe("getBalances", () => {
    it("should update balances state with token balances", async () => {
      const mockSetBalances = jest.fn();
      const mockWalletId = "0x123";
      const mockTokenBalances = [
        { name: "ETH", balance: "1.0000", icon: "ETH-icon" },
        { name: "USDC", balance: "2.0000", icon: "USDC-icon" },
        { name: "STRK", balance: "3.0000", icon: "STRK-icon" },
      ];

      jest
        .spyOn(require("../../src/services/wallet"), "getTokenBalances")
        .mockResolvedValue(mockTokenBalances);

      await getBalances(mockWalletId, mockSetBalances);
      await mockSetBalances(mockTokenBalances);

      expect(mockSetBalances).toHaveBeenCalledWith(mockTokenBalances);
    });

    it("should not fetch balances if wallet ID is not provided", async () => {
      const mockSetBalances = jest.fn();
      const mockGetTokenBalances = jest.spyOn(
        require("../../src/services/wallet"),
        "getTokenBalances"
      );

      await getBalances(null, mockSetBalances);

      expect(mockGetTokenBalances).not.toHaveBeenCalled();
      expect(mockSetBalances).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should clear wallet ID from local storage", () => {
      const mockRemoveItem = jest.fn();
      Object.defineProperty(window, "localStorage", {
        value: {
          removeItem: mockRemoveItem,
        },
        writable: true,
      });

      logout();

      expect(mockRemoveItem).toHaveBeenCalledWith("wallet_id");
    });
  });
});
