import './form.css';
import { ReactComponent as ETH } from '../../assets/icons/ethereum.svg';
import { ReactComponent as USDC } from '../../assets/icons/borrow_usdc.svg';
import { ReactComponent as STRK } from '../../assets/icons/strk.svg';
import { ReactComponent as DAI } from '../../assets/icons/dai.svg';
import { ReactComponent as Star } from '../../assets/particles/star.svg';
import React, { useState } from 'react';

const Form = () => {
    const formData = [
        {
            icon: <ETH />,
            title: 'ETH',
            balance: '0.046731'
        },
        {
            icon: <USDC />,
            title: 'USDC',
            balance: '0.046731'
        },
        {
            icon: <STRK />,
            title: 'STRK',
            balance: '0.046731'
        },
        {
            icon: <DAI />,
            title: 'DAI',
            balance: '0.046731'
        }
    ];

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

    const [tokenAmount, setTokenAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (tokenAmount.trim() === '') {
            setError(`This field is required !`);
        } else {
            setError('');
            setTokenAmount('');
        }
    };

    const starData = [
        { top: 40, left: 13, size: 15 },
        { top: 100, left: 5, size: 10,},
        { top: 45, left: 76, size: 13 },
        { top: 90, left: 87, size: 12 },
    ]

    return (
        <div className="form-container">
            <div className="form-gradient"></div>
            <div className="form-gradient"></div>
            {starData.map((star, index) => (
                <Star key={index} style={{
                    position: 'absolute',
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                    width: `${star.size}%`,
                    height: `${star.size}%`
                }}/>
            ))}
            <div className="form-card__container flex">
                {formData.map((token, index) => (
                    <div className="form-card flex" key={index}>
                        <p>
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
                                <input type="radio" id={token.id} name="token-options"/>
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
                            className={error ? 'error' : ''} // Add error class if there's an error
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
                                <input type="radio" id={multiplier.id} name="card-options"/>
                                <label htmlFor={multiplier.id}>{multiplier.value}</label>
                            </div>
                        ))}
                    </div>
                    <div className="submit">
                        <button type="submit" className='launch-button'>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form;
