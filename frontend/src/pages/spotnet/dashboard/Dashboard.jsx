
import React from 'react';
import { ReactComponent as Star } from "../../../assets/particles/star.svg";
import { ReactComponent as CollateralIcon } from "../../../assets/icons/collateral.svg";
import { ReactComponent as EthIcon } from "../../../assets/icons/ethereum.svg";
import { ReactComponent as UsdIcon } from "../../../assets/icons/usd_coin.svg";
import { ReactComponent as BorrowIcon } from "../../../assets/icons/borrow.svg";
import './dashboard.css';

const Dashboard = () => {
    return (
        <div className="container-fluid position-relative container">
            <div className="backdround-gradients">
                <div className="backdround-gradient"></div>
                <div className="backdround-gradient"></div>
            </div>
            <h1 className="text-white text-center" style={{ fontSize: '48px', marginBottom: '24px' }}>
                zkLend Position
            </h1>
            <Star className="star star-1" />
            <Star className="star star-2" />
            <Star className="star star-3" />
            <section className="card d-flex flex-column align-items-center card-shadow"
                style={{
                    background: 'linear-gradient(to bottom right, rgba(116, 214, 253, 0.5) 0%, rgba(11, 12, 16, 0.5) 100%)',
                    padding: '36px',
                    borderRadius: '8px',
                    width: '100%',
                    border: '0.5px solid #74D6FD',
                    maxWidth: '1312px',
                    height: '146px',
                }}>
                <div className="content rounded bg-custom-color d-flex align-items-center"
                    style={{
                        height: '74px',
                        padding: '23px 24px',
                    }}>
                    <span className="dashboard-text" style={{ fontSize: '26px', fontWeight: 500, margin: 0, marginRight: '12px' }}>
                        Health factor:
                    </span>
                    <span className="text-white" style={{ fontSize: '32px', fontWeight: 600, margin: 0 }}>
                        {1.475706}
                    </span>
                </div>
            </section>
            <section className="mb-4 d-flex flex-row justify-content-center" style={{ maxWidth: '100%', margin: 'auto' }}>
                <div className='card rounded card-shadow' 
                    style={{ 
                        flex: 1, 
                        marginRight: '15px', 
                        marginTop: '29px', 
                        background: 'linear-gradient(to bottom right, rgba(116, 214, 253, 0.5) 0%, rgba(11, 12, 16, 0.5) 100%)', 
                        border: '0.5px solid #74D6FD', 
                        }}>
                <header className="card-header bg-custom-color text-light text-center card-shadow">
                    <div className="d-flex align-items-center justify-content-center">
                        <CollateralIcon width={44} height={44} className="rounded-circle" />
                    <h1 className="ms-2 coll-earn-text icon-text-gap mb-0" style={{ fontSize: '32px', fontWeight: 600 }}>Collateral & Earnings</h1>
                    </div>
                </header>
                <div 
                    className="card-body" 
                    style={{ 
                        color: 'white', paddingTop: '24px', paddingBottom: '36px' 
                    }}
                > 
                    <div className="d-flex flex-column align-items-center bg-custom-color rounded" style={{ padding: '30px 65px'}}>
                    <div className="d-flex align-items-center mb-3">
                        <EthIcon width={44} height={44} className="rounded-circle" />
                        <span className="ms-2 icon-text-gap" style={{ fontSize: '32px', fontWeight: 600 }}>Ethereum</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="dashboard-text" style={{ fontSize: '26px', fontWeight: 500 }}>Balance:</span>
                        <span className="text-success ms-2 icon-text-gap" style={{ fontSize: '32px', fontWeight: 600 }}>0.039404186081257303</span>
                    </div>
                    </div>
                </div>
                </div>
                <div className='card rounded card-shadow' 
                    style={{ 
                        flex: 1, 
                        marginLeft: '15px', 
                        marginTop: '29px', 
                        background: 'linear-gradient(to bottom right, rgba(116, 214, 253, 0.5) 0%, rgba(11, 12, 16, 0.5) 100%)', 
                        border: '0.5px solid #74D6FD',
                        }}>
                <header className="card-header bg-custom-color text-center card-shadow">
                    <div className="d-flex align-items-center justify-content-center">
                        <BorrowIcon width={44} height={44} className="rounded-circle" />
                    <h1 className="ms-2 borr-text icon-text-gap mb-0" style={{ fontSize: '32px', fontWeight: 600 }}>Borrow</h1>
                    </div>
                </header>
                <div 
                    className="card-body" 
                    style={{ 
                        color: 'white', paddingTop: '24px', paddingBottom: '36px' 
                    }}
                > 
                    <div className="d-flex flex-column align-items-center bg-custom-color rounded" style={{ padding: '30px 65px'}}>
                    <div className="d-flex align-items-center mb-3">
                        <UsdIcon width={44} height={44} className="rounded-circle" />
                        <span className="ms-2 icon-text-gap" style={{ fontSize: '32px', fontWeight: 600 }}>USD Coin</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="dashboard-text" style={{ fontSize: '26px', fontWeight: 500 }}>Balance:</span>
                        <span className="ms-2 borr-text icon-text-gap" style={{ fontSize: '32px', fontWeight: 600 }}>-55.832665</span>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            <section >
                <button className="btn redeem-btn border-0">Redeem</button>
            </section>
        </div>
    )
}

export default Dashboard;