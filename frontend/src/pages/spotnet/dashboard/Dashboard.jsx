import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactComponent as Star } from "../../../assets/particles/star.svg";
import { ReactComponent as CollateralIcon } from "../../../assets/icons/collateral.svg";
import { ReactComponent as EthIcon } from "../../../assets/icons/ethereum.svg";
import { ReactComponent as UsdIcon } from "../../../assets/icons/usd_coin.svg";
import { ReactComponent as BorrowIcon } from "../../../assets/icons/borrow.svg";
import './dashboard.css';


const fetchCardData = async () => { 
    try {
        const response = await axios.get('https://spotnet.xyz/api/dashboard');
        return response.data;
    } catch (error) {
        console.error("Error during getting the data from API", error);
        return [];
    }
};

const Dashboard = () => {
    const [cardData, setCardData] = useState([]);
    const [healthFactor, setHealthFactor] = useState(null);
    const [loading, setLoading] = useState(true);

    const starData = [
        { top: 1, left: 0, size: 1.5 },
        { top: 75, left: 35, size: 2.5 },
        { top: -2, left: 94, size: 5.5 },
    ];
    
    useEffect(() => { 
        const getData = async () => {
            const data = await fetchCardData();
            const positions = data.zklend_position.products[0].positions;
            const healthRatio = data.zklend_position.products[0].health_ratio;

            const cardData = positions.map(position => ({
                title: position.data.collateral ? "Collateral & Earnings" : "Borrow",
                icon: position.data.collateral ? CollateralIcon : BorrowIcon,
                balance: position.totalBalances[Object.keys(position.totalBalances)[0]],
                currency: position.data.collateral ? "Ethereum" : "USD Coin",
                currencyIcon: position.data.collateral ? EthIcon : UsdIcon,
                currencyName: position.data.collateral ? "Ethereum" : "USD Coin",
            }));
            
            setCardData(cardData);
            setHealthFactor(healthRatio);
            setLoading(false);
        };

        getData();
    }, []);

    if (loading) {
        return <div className="d-flex text-white justify-content-center align-items-center min-vh-100">Loading...</div>;
    }

    return (
        <div className="container dashboard-container">
            {starData.map((star, index) => (
                <Star key={index} style={{
                    position: 'absolute',
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                    width: `${star.size}%`,
                    height: `${star.size}%`
                }}/>
            ))}
            <div className="backdround-gradients position-relative">
                <div className="backdround-gradient"></div>
                <div className="backdround-gradient"></div>
            </div>
            <h1 className="text-white text-center zkLend-text">
                zkLend Position
            </h1>
            <div className="card card-health-factor mx-auto d-flex flex-column align-items-center justify-content-center card-shadow">
                <div className="content bg-custom-health d-flex align-items-center px-4 py-3 rounded bg-card-health">
                    <span className="dashboard-text-color health-text-size">
                        Health factor:
                    </span>
                    <span className="text-white text-style">
                        {healthFactor}
                    </span>
                </div>
            </div>
            <div className="mb-4 d-flex flex-row justify-content-center cards-custom">
                {cardData.map((card, index) => (
                    <div key={index} className="card card-custom-styles d-flex flex-column align-item-center card-shadow">
                        <header className="card-header bg-custom-color text-light text-center card-shadow">
                            <div className="d-flex align-items-center justify-content-center">
                                <card.icon className="card-icons rounded-circle" />
                                <h1 className="ms-2 icon-text-gap mb-0 text-style" 
                                    style={{ color: card.title === "Borrow" ? "var(--borrow-color)" : "var(--collateral-color)" }}>
                                    {card.title}
                                </h1>
                            </div>
                        </header>
                        <div className="card-body card-body-custom">
                            <div className="d-flex flex-column align-items-center bg-custom-color rounded">
                                <div className="d-flex align-items-center mb-3">
                                    <card.currencyIcon className="card-icons rounded-circle" />
                                    <span className="ms-2 icon-text-gap text-style">{card.currencyName}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="dashboard-text-color balance-text-size">Balance:</span>
                                    <span className="ms-2 borr-text icon-text-gap text-style" style={{
                                        color: card.title === "Borrow" ? "var(--borrow-color)" : "var(--collateral-color)" }}>
                                        {card.balance}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div> 
            <div >
                <button className="btn redeem-btn border-0">Redeem</button>
            </div>
        </div>
    );
}

export default Dashboard;