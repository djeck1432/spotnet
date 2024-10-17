import './form.css';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ETH } from '../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../assets/icons/strk.svg';
import { ReactComponent as DAI } from '../../assets/icons/dai.svg';
import { ReactComponent as Star } from '../../assets/particles/star.svg';
import { getTokenBalances } from '../../utils/wallet';
import { sendTransaction } from '../../utils/transaction';
import axios from 'axios';

const Form = ({ walletId }) => {
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
        // Fetch balances from the backend endpoint
        const getBalances = async () => {
            try {
                const data = await getTokenBalances(walletId);

                const updatedBalances = [
                    { icon: <ETH />, title: 'ETH', balance: data.ETH !== undefined ? data.ETH.toString() : '0.00' },
                    { icon: <USDC />, title: 'USDC', balance: data.USDC !== undefined ? data.USDC.toString() : '0.00' },
                    { icon: <STRK />, title: 'STRK', balance: data.STRK !== undefined ? data.STRK.toString() : '0.00' },
                    { icon: <DAI />, title: 'DAI', balance: data.DAI !== undefined ? data.DAI.toString() : '0.00' },
                ];

                setBalances(updatedBalances);
            } catch (error) {
                console.error('Error fetching user balances:', error);
            }
        };

        if (walletId) {
            getBalances();
        }
    }, [walletId]);

    const Tokens = [
        { id: 'ethOption', component: <ETH />, label: 'ETH' },
        { id: 'usdcOption', component: <USDC />, label: 'USDC' },
        { id: 'strkOption', component: <STRK />, label: 'STRK' },
        { id: 'daiOption', component: <DAI />, label: 'DAI' },
    ];

    const Multipliers = [
        { id: 'option1', value: 'x5', recommended: true },
        { id: 'option2', value: 'x4', recommended: false },
        { id: 'option3', value: 'x3', recommended: false },
        { id: 'option4', value: 'x2', recommended: false },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://0.0.0.0:8000';

        if (!tokenAmount.trim() || !selectedToken || !selectedMultiplier) {
            setError('All fields are required!');
        } else {
            setError('');
            setLoading(true);

            // Prepare form data for submission
            const formData = {
                wallet_id: walletId,
                token_symbol: selectedToken,
                amount: tokenAmount,
                multiplier: selectedMultiplier,
            };

            try {
                // Send form data to the backend
                const response = await axios.post(`${backendUrl}/api/create-position`, formData);
                console.log('Position created successfully:', response.data);

                // Step 2: Use the transaction data returned by the backend to execute the transaction
                const transactionData = response.data;

                await sendTransaction(transactionData, transactionData.contract_address);
                console.log('Transaction executed successfully');

                // Step 3: Send request to update position status
                const openPositionResponse = await axios.get(`${backendUrl}/api/open-position`, {
                    params: { position_id: transactionData.position_id }
                });

                console.log('Position status updated successfully:', openPositionResponse.data);

                // Reset the token amount
                setTokenAmount('');
            } catch (err) {
                console.error('Failed to create position:', err);
            } finally {
                setLoading(false);
            }
        }
    };


    const starData = [
        { top: 30, left: 13, size: 8 },
        { top: 70, left: 5, size: 6 },
        { top: 35, left: 76, size: 5 },
        { top: 55, left: 87, size: 6 },
    ];

    return (
        <div className="form-container container">
            <div className="form-gradient"></div>
            <div className="form-gradient"></div>
            {starData.map((star, index) => (
                <Star
                    key={index}
                    style={{
                        position: 'absolute',
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: `${star.size}%`,
                        height: `${star.size}%`,
                    }}
                />
            ))}
            <div className="form-card__container flex">
                {balances.map((token, index) => (
                    <div className="form-card flex" key={index}>
                        <p className="form-card-text">
                            <span>{token.icon}</span>
                            <span>{token.title}</span> Balance:
                        </p>
                        <h3>{token.balance}</h3>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-wrapper">
                    <div className="form-title">
                        <h1>Submit your leverage details</h1>
                    </div>
                    <label>Select Token</label>
                    <div className="form-token">
                        {Tokens.map((token) => (
                            <div className="token-card flex" key={token.id}>
                                <input
                                    type="radio"
                                    id={token.id}
                                    name="token-options"
                                    value={token.label}
                                    onChange={() => setSelectedToken(token.label)}
                                />
                                <label htmlFor={token.id}>
                                    <h5>{token.component} {token.label}</h5>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="token-label">
                        <label>Token Amount</label>
                        {error && <p className="error-message">{error}</p>} {/* Error message above input */}
                        <input
                            type="number"
                            placeholder='Enter Token Amount'
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                            className={error ? 'error' : ''}
                        />
                    </div>
                    <h5>Select Multiplier</h5>
                    <div className="multiplier-card">
                        {Multipliers.map((multiplier) => (
                            <div className="multiplier-item" key={multiplier.id}>
                                {multiplier.recommended && (
                                    <div className="recommended">
                                        <p>Recommended</p>
                                    </div>
                                )}
                                <input
                                    type="radio"
                                    id={multiplier.id}
                                    name="card-options"
                                    value={multiplier.value}
                                    onChange={() => setSelectedMultiplier(multiplier.value.replace('x', ''))}
                                />
                                <label htmlFor={multiplier.id}>{multiplier.value}</label>
                            </div>
                        ))}
                    </div>
                    <div className="submit">
                        <button type="submit" className='form-button'>Submit</button>
                    </div>
                    {loading && <p className="loading-message">Loading...</p>}
                </div>
            </form>
        </div>
    );
};

export default Form;

