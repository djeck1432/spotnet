import './form.css';
import React, { useEffect, useState } from 'react';
import TokenSelector from '../../components/TokenSelector';
import MultiplierSelector from '../../components/MultiplierSelector';
import { connectWallet, getBalances } from '../../services/wallet';
import { handleTransaction } from '../../services/transaction';
import Spinner from '../../components/spinner/Spinner';
import { ReactComponent as ETH } from '../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../assets/icons/strk.svg';
import { ReactComponent as DAI } from '../../assets/icons/dai.svg';

const Form = ({ walletId, setWalletId }) => {
    const [balances, setBalances] = useState([
        { icon: <ETH />, title: 'ETH', balance: '0.00' },
        { icon: <USDC />, title: 'USDC', balance: '0.00' },
        { icon: <STRK />, title: 'STRK', balance: '0.00' },
        { icon: <DAI />, title: 'DAI', balance: '0.00' },
    ]);
    const [tokenAmount, setTokenAmount] = useState('');
    const [selectedToken, setSelectedToken] = useState('');
    const [selectedMultiplier, setSelectedMultiplier] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBalances(walletId, setBalances);
    }, [walletId]);

    const connectWalletHandler = async () => {
        try {
            setError(null);
            const address = await connectWallet();
            if (address) {
                setWalletId(address); // Correctly set the walletId using the passed setWalletId function
                console.log("Wallet successfully connected. Address:", address);
                return address;
            } else {
                setError('Failed to connect wallet. Please try again.');
                console.error("Wallet connection flag is false after enabling");
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            setError('Failed to connect wallet. Please try again.');
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let connectedWalletId = walletId;

        if (!connectedWalletId) {
            connectedWalletId = await connectWalletHandler();
        }

        if (connectedWalletId) {
            const formData = {
                wallet_id: connectedWalletId,
                token_symbol: selectedToken,
                amount: tokenAmount,
                multiplier: selectedMultiplier,
            };
            await handleTransaction(connectedWalletId, formData, setError, setTokenAmount, setLoading);
        }
    };

    return (
        <div className="form-container container">
            {/* The rest of the UI stays largely unchanged */}
            <form onSubmit={handleSubmit}>
                <div className="form-wrapper">
                    <div className="form-title">
                        <h1>Submit your leverage details</h1>
                    </div>
                    <label>Select Token</label>
                    <TokenSelector setSelectedToken={setSelectedToken} />
                    <div className="token-label">
                        <label>Token Amount</label>
                        {error && <p className="error-message">{error}</p>}
                        <input
                            type="number"
                            placeholder='Enter Token Amount'
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                            className={error ? 'error' : ''}
                        />
                    </div>
                    <h5>Select Multiplier</h5>
                    <MultiplierSelector setSelectedMultiplier={setSelectedMultiplier} />
                    <div className="submit">
                        <button type="submit" className='form-button'>Submit</button>
                    </div>
                </div>
            </form>
            <Spinner loading={loading} />
        </div>
    );
};

export default Form;
