import React, { useEffect } from 'react';
import './history.css'; 
import healthSvg from "../../../assets/icons/health.svg"
import eth from "../../../assets/icons/zklend_eth_collateral.svg"
import strk from "../../../assets/icons/strk.svg"
import arrowLeft from "../../../assets/icons/arrow-left-02.svg"
import arrowRight from "../../../assets/icons/arrow-right-02.svg"

const History = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    // const sectionsData = [
    //     {
    //         id: 'welcome',
    //         title: 'Welcome',
    //         content: [
    //             {
    //                 type: 'text',
    //                 value:
    //                     'Welcome to [Product Name], the decentralized platform designed to empower you with seamless access to the Web3 ecosystem. Built on blockchain technology, [Product Name] provides a secure, transparent, and user-friendly experience for managing your digital assets, accessing decentralized finance (DeFi) services, and engaging with the broader Web3 community.',
    //             },
    //             {
    //                 type: 'text',
    //                 value: 'Key Features:',
    //             },
    //             {
    //                 type: 'list',
    //                 items: [
    //                     'Secure Asset Management: Store, track, and manage your digital assets with a security-first approach, utilizing smart contracts to protect your funds.',
    //                     'DeFi Integration: Access a suite of decentralized finance tools, including staking, lending, and borrowing, all from one intuitive interface.',
    //                     'Cross-Chain Compatibility: Interact with assets across multiple blockchain networks without needing to switch platforms.',
    //                     'Personalized Notifications: Enable real-time notifications for essential updates, such as changes in your health factor, to stay informed on your account status.',
    //                 ],
    //             },
    //         ],
    //     },
    //     {
    //         id: 'how-it-works',
    //         title: 'How It Works',
    //         content: [
    //             {
    //                 type: 'orderedList',
    //                 items: [
    //                     'Connect Your Wallet: Use any Web3-compatible wallet, such as MetaMask, to connect to [Product Name] securely and begin exploring the platform.',
    //                     'Choose A Service: Select from the various DeFi services, asset management tools, and community engagement features.',
    //                     'Transact Seamlessly: Every transaction is processed transparently on-chain, giving you control and visibility over your digital activities.',
    //                 ],
    //             },
    //         ],
    //     },
    // ];

    return (
        <div className="overview-container">
            <div className='side_nav'>
                <nav>
                    <ul>
                        <li>Dashbord</li>
                        <li>position</li>
                        <li>position history</li>
                        <li>deposit</li>
                        <li>form</li>
                    </ul>
                </nav>
            </div>

            <aside>
                <h1>zkLend Position History</h1>
                <div className='card_container'>
                    <div className="card">
                        <div className='card_container_sub_data'>
                        <img src={healthSvg} alt="health" />
                        <h4>Health Factor</h4>
                        </div>
                        <span className='text-green'>1.47570678</span>
                    </div>
                    <div className="card">
                        <div className='card_container_sub_data'>
                        <img src={eth} alt="health" />
                        <h4>Borrow Balance</h4>
                        </div>
                      <span>$-55.832665</span>
                    </div>
                </div>
                <div className='table-container'>
                <h2>position history</h2>
                <table>
                <thead className='table-header'>
                   <tr>
                   <th>token</th>
                    <th>amount</th>
                    <th>created at</th>
                    <th>status</th>
                    <th>start price</th>
                    <th>multiplier</th>
                    <th>liquidated</th>
                    <th>closed at</th>
                   </tr>
                </thead>
               <tbody>
               <tr className='item'>
               <td className='num'>1</td>
                    <td className='table-token'>
                        <img src={strk} alt="token" />
                        <td>STRK</td>
                    </td>
                    <td>amount</td>
                    <td>created at</td>
                    <td>status</td>
                    <td>start price</td>
                    <td>multiplier</td>
                    <td>liquidated</td>
                    <td>closed at</td>
                </tr>
                <tr className='item'>
                    <td className='num'>1</td>
                    <td className='table-token'>
                        <img src={strk} alt="token" />
                        <td>STRK</td>
                    </td>
                    <td>amount</td>
                    <td>created at</td>
                    <td>status</td>
                    <td>start price</td>
                    <td>multiplier</td>
                    <td>liquidated</td>
                    <td>closed at</td>
                </tr>
                <tr className='item'>
                <td className='num'>1</td>
                    <td className='table-token'>
                        <img src={strk} alt="token" />
                        <td>STRK</td>
                    </td>
                    <td>amount</td>
                    <td>created at</td>
                    <td>status</td>
                    <td>start price</td>
                    <td>multiplier</td>
                    <td>liquidated</td>
                    <td>closed at</td>
                </tr>
                <tr className='item'>
                <td className='num'>1</td>
                    <td className='table-token'>
                        <img src={strk} alt="token" />
                        <td>STRK</td>
                    </td>
                    <td>amount</td>
                    <td>created at</td>
                    <td>status</td>
                    <td>start price</td>
                    <td>multiplier</td>
                    <td>liquidated</td>
                    <td>closed at</td>
                </tr>
                <tr className='item'>
                <td className='num'>1</td>
                    <td className='table-token'>
                        <img src={strk} alt="token" />
                        <td>STRK</td>
                    </td>
                    <td>amount</td>
                    <td>created at</td>
                    <td>status</td>
                    <td>start price</td>
                    <td>multiplier</td>
                    <td>liquidated</td>
                    <td>closed at</td>
                </tr>
               </tbody>
            </table>
                </div>
                <div className='pagination'>
                <div className='btn-img'>
                <img src={arrowLeft} alt="arro-btn" />
                </div>
                <div className='section-num'>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                </div>
               <div className='btn-img'>
               <img src={arrowRight} alt="arrow-btn" />
               </div>
            </div>
            </aside>
        </div>
    );
};

export default History;                