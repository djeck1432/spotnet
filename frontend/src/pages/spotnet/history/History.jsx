import React, { useEffect } from 'react';
import './history.css';
import TableOfContents from 'components/TableOfContent/TableOfContents';
import ScrollButton from 'components/scrollButton/ScrollButton';
import Sections from 'components/Sections';
import healthSvg from "../../../assets/icons/health.svg"

const History = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // const tableOfContents = [
    //     { title: 'Welcome', link: '#welcome' },
    //     {
    //         title: 'How it works',
    //         link: '#how-it-works',
    //         subItems: [
    //             { title: 'Connect Your Wallet', link: '#connect-wallet' },
    //             { title: 'Choose A Service', link: '#choose-service' },
    //             { title: 'Transact Seamlessly', link: '#transact-seamlessly' },
    //         ],
    //     },
    //     { title: 'Supported Chains', link: '#supported-chains' },
    // ];

    const sectionsData = [
        {
            id: 'welcome',
            title: 'Welcome',
            content: [
                {
                    type: 'text',
                    value:
                        'Welcome to [Product Name], the decentralized platform designed to empower you with seamless access to the Web3 ecosystem. Built on blockchain technology, [Product Name] provides a secure, transparent, and user-friendly experience for managing your digital assets, accessing decentralized finance (DeFi) services, and engaging with the broader Web3 community.',
                },
                {
                    type: 'text',
                    value: 'Key Features:',
                },
                {
                    type: 'list',
                    items: [
                        'Secure Asset Management: Store, track, and manage your digital assets with a security-first approach, utilizing smart contracts to protect your funds.',
                        'DeFi Integration: Access a suite of decentralized finance tools, including staking, lending, and borrowing, all from one intuitive interface.',
                        'Cross-Chain Compatibility: Interact with assets across multiple blockchain networks without needing to switch platforms.',
                        'Personalized Notifications: Enable real-time notifications for essential updates, such as changes in your health factor, to stay informed on your account status.',
                    ],
                },
            ],
        },
        {
            id: 'how-it-works',
            title: 'How It Works',
            content: [
                {
                    type: 'orderedList',
                    items: [
                        'Connect Your Wallet: Use any Web3-compatible wallet, such as MetaMask, to connect to [Product Name] securely and begin exploring the platform.',
                        'Choose A Service: Select from the various DeFi services, asset management tools, and community engagement features.',
                        'Transact Seamlessly: Every transaction is processed transparently on-chain, giving you control and visibility over your digital activities.',
                    ],
                },
            ],
        },
    ];

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
                        1.47570678
                    </div>
                    <div className="card">
                        <div className='card_container_sub_data'>
                        <img src={healthSvg} alt="health" />
                        <h4>Health Factor</h4>
                        </div>
                        1.47570678
                    </div>
                </div>
                <div className='table-container'>
                <h2>position history</h2>
                <section>
                <div>
                    <h3>token</h3>
                    <h3>amount</h3>
                    <h3>created at</h3>
                    <h3>status</h3>
                    <h3>start price</h3>
                    <h3>multiplier</h3>
                    <h3>liquidated</h3>
                    <h3>closed at</h3>
                </div>
            </section>
                </div>
            </aside>
            <ScrollButton />
        </div>
    );
};

export default History;
