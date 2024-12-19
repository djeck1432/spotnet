import { connect } from 'starknetkit';
import { ETH_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from '../utils/constants';
import { ReactComponent as ETH } from 'assets/icons/ethereum.svg';
import { ReactComponent as USDC } from 'assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from 'assets/icons/strk.svg';

const CRM_TOKEN_ADDRESS = "0x051c4b1fe3bf6774b87ad0b15ef5d1472759076e42944fff9b9f641ff13e5bbe";

export const checkForCRMToken = async (walletAddress) => {
  if (process.env.REACT_APP_IS_DEV === "true") {
    console.log("Development mode: Skipping CRM token check.");
    return true;
  }

  try {
    const { wallet } = await connect();
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    const response = await wallet.account.callContract({
      contractAddress: CRM_TOKEN_ADDRESS,
      entrypoint: 'balanceOf',
      calldata: [walletAddress],
    });

    const balance = BigInt(response[0]).toString();

    if (Number(balance) > 0) {
      return true;
    } else {
      alert("Beta testing is allowed only for users who hold the CRM token.");
      return false;
    }
  } catch (error) {
    console.error("Error checking CRM token balance:", error);
    throw error;
  }
};

export const connectWallet = async () => {
  try {
    console.log('Attempting to connect to wallet...');

    const { wallet } = await connect({
      include: ['argentX', 'braavos'],
      modalMode: "alwaysAsk",
      modalTheme: "light"
    });

    if (!wallet) {
      console.error('No wallet found');
      throw new Error('Failed to connect to wallet');
    }

    // Ensure the wallet is connected
    await wallet.enable();

    const address = wallet.selectedAddress || wallet.account.address;

    if (!address) {
      throw new Error('No wallet address found');
    }

    console.log('Wallet successfully connected. Address:', address);
    return address;
  } catch (error) {
    console.error('Error connecting wallet:', error.message);
    throw error;
  }
};

export function logout() {
  localStorage.removeItem('wallet_id');
}

export async function getTokenBalances(walletAddress) {
  try {
    const { wallet } = await connect();
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    const tokenBalances = {
      ETH: await getTokenBalance(wallet, walletAddress, ETH_ADDRESS),
      USDC: await getTokenBalance(wallet, walletAddress, USDC_ADDRESS),
      STRK: await getTokenBalance(wallet, walletAddress, STRK_ADDRESS),
    };

    return tokenBalances;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
}

async function getTokenBalance(wallet, walletAddress, tokenAddress) {
  try {
    const response = await wallet.account.callContract({
      contractAddress: tokenAddress,
      entrypoint: 'balanceOf',
      calldata: [walletAddress],
    });
    
    const tokenDecimals = (tokenAddress === USDC_ADDRESS) ? 6 : 18;
    const balance = BigInt(response[0]).toString();
    const readableBalance = (Number(balance) / (10 ** tokenDecimals)).toFixed(4);
    console.log(`Balance for token ${tokenAddress}:`, readableBalance);
    return readableBalance;
  } catch (error) {
    console.error(`Error fetching balance for token ${tokenAddress}:`, error);
    return '0';
  }
}

export const getBalances = async (walletId, setBalances) => {
  if (!walletId) return;
  try {
    const data = await getTokenBalances(walletId);

    const updatedBalances = [
      {
        icon: <ETH />,
        title: 'ETH',
        balance: data.ETH !== undefined ? data.ETH.toString() : '0.00',
      },
      {
        icon: <USDC />,
        title: 'USDC',
        balance: data.USDC !== undefined ? data.USDC.toString() : '0.00',
      },
      {
        icon: <STRK />,
        title: 'STRK',
        balance: data.STRK !== undefined ? data.STRK.toString() : '0.00',
      },
    ];

    setBalances(updatedBalances);
  } catch (error) {
    console.error('Error fetching user balances:', error);
  }
};


const BigInt = window.BigInt;