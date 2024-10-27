import { connect } from "get-starknet";
import { ETH_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from "./constants";
import { ReactComponent as ETH } from "../assets/icons/ethereum.svg";
import { ReactComponent as USDC } from "../assets/icons/borrow_usdc.svg";
import { ReactComponent as STRK } from "../assets/icons/strk.svg";
import { ReactComponent as DAI } from "../assets/icons/dai.svg";

const handleConnectWallet = async (setWalletId, setError) => {
  try {
    setError(null);
    const address = await connectWallet();
    if (address) {
      setWalletId(address);
    }
  } catch (err) {
    console.error("Failed to connect wallet:", err);
    setError(err.message);
  }
};

export const connectWallet = async () => {
  try {
    console.log("Attempting to connect to wallet...");

    const starknet = await connect({
      modalMode: "alwaysAsk",
      modalTheme: "light",
    });

    if (!starknet) {
      console.error("No Starknet object found");
      throw new Error("Failed to connect to wallet");
    }

    await starknet.enable();

    if (starknet.isConnected) {
      const address = starknet.selectedAddress;
      console.log("Wallet successfully connected. Address:", address);
      return address;
    } else {
      throw new Error("Wallet connection failed");
    }
  } catch (error) {
    console.error("Error connecting wallet:", error.message);
    throw error;
  }
};

export function logout() {
  // Clear local storage
  localStorage.removeItem("wallet_id");
}

export async function getTokenBalances(walletAddress) {
  try {
    const starknet = await connect();
    if (!starknet.isConnected) {
      throw new Error("Wallet not connected");
    }

    const tokenBalances = {
      ETH: await getTokenBalance(starknet, walletAddress, ETH_ADDRESS),
      USDC: await getTokenBalance(starknet, walletAddress, USDC_ADDRESS),
      STRK: await getTokenBalance(starknet, walletAddress, STRK_ADDRESS),
    };

    return tokenBalances;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
}

async function getTokenBalance(starknet, walletAddress, tokenAddress) {
  try {
    const response = await starknet.provider.callContract({
      contractAddress: tokenAddress,
      entrypoint: "balanceOf",
      calldata: [walletAddress],
    });

    // Convert the balance to a human-readable format
    // Note: This assumes the balance is returned as a single uint256
    // You may need to adjust this based on the actual return value of your contract
    const balance = BigInt(response.result[0]).toString();

    // Convert to a more readable format (e.g., whole tokens instead of wei)
    // This example assumes 18 decimal places, adjust as needed for each token
    const readableBalance = (Number(balance) / 1e18).toFixed(4);

    return readableBalance;
  } catch (error) {
    console.error(`Error fetching balance for token ${tokenAddress}:`, error);
    return "0"; // Return '0' in case of error
  }
}

export const getBalances = async (walletId, setBalances) => {
  if (!walletId) return;
  try {
    const data = await getTokenBalances(walletId);

    const updatedBalances = [
      {
        icon: <ETH />,
        title: "ETH",
        balance: data.ETH !== undefined ? data.ETH.toString() : "0.00",
      },
      {
        icon: <USDC />,
        title: "USDC",
        balance: data.USDC !== undefined ? data.USDC.toString() : "0.00",
      },
      {
        icon: <STRK />,
        title: "STRK",
        balance: data.STRK !== undefined ? data.STRK.toString() : "0.00",
      },
      // { icon: <DAI />, title: 'DAI', balance: data.DAI !== undefined ? data.DAI.toString() : '0.00' },  dont have DAI in the constants file
    ];

    setBalances(updatedBalances);
  } catch (error) {
    console.error("Error fetching user balances:", error);
  }
};

// Add this line at the top of your file if you're using Create React App or a similar setup
// that doesn't recognize BigInt as a global
const BigInt = window.BigInt;
