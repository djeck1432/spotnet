import React, { useEffect } from 'react';
import './documentation.css';
import TableOfContents from '../../../components/TableOfContent/TableOfContents';
import ScrollButton from '../../../components/scrollButton/ScrollButton';
import Sections from 'components/Sections';

const Documentation = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const tableOfContents = [
    { title: 'Introduction', link: '#introduction' },
    {
      title: 'Overview',
      link: '#overview',
      subItems: [
        { title: 'Cosmos Overview', link: '#cosmos-1' },
        { title: 'Cosmos Overview', link: '#cosmos-2' },
        { title: 'Cosmos Overview', link: '#cosmos-3' },
        { title: 'Cosmos Overview', link: '#cosmos-4' }
      ]
    },
    { title: 'How it performs', link: '#how-it-performs' },
    { title: 'Getting Started', link: '#getting-started' },
    { title: 'The Hub And Zones', link: '#hub-1' },
    { title: 'The Hub And Zones', link: '#hub-2' },
    { title: 'The Hub And Zones', link: '#hub-3' },
    { title: 'The Hub And Zones', link: '#hub-4' },
    { title: 'The Hub And Zones', link: '#hub-5' }
  ];

  const sectionsData = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: [
        {
          type: 'text',
          value:
            'Welcome to zkLend Documentation\nzkLend is a decentralized platform designed to [describe purpose, e.g., "empower users to securely manage digital assets and access DeFi tools effortlessly"]. This documentation provides a comprehensive guide on using SpotNet and making the most of its features.',
        },
      ],
    },
    {
      id: 'overview',
      title: 'Overview',
      content: [
        {
          type: 'text',
          value:
            'What is [Product Name]?\n[Product Name] is a Web3 platform that leverages blockchain technology to [describe primary functionalities, e.g., "facilitate secure transactions, staking, and asset management without intermediaries"].',
        },
        {
          type: 'text',
          value: 'Core features include:',
        },
        {
          type: 'list',
          items: [
            'Decentralized Finance (DeFi): Access a suite of DeFi services, including lending, borrowing, and yield farming.',
            'Security-First Design: Built on smart contracts to ensure safety and transparency.',
            'Cross-Chain Compatibility: [Product Name] supports multiple blockchains for a seamless user experience.',
          ],
        },
      ],
    },
    {
      id: 'how-it-performs',
      title: 'How it performs',
      content: [
        {
          type: 'text',
          value: 'Spot Leverage Strategy with ZkLend',
        },
        {
          type: 'list',
          items: [
            'You put some ETH collateral into deposit as ZkLend.',
            'Then, we swap your ETH into USDC and use it as collateral for a loan in the ZkLend position.',
            'This process can be repeated 2 to 5 times, depending on the leverage multiplier you choose, to increase your collateral and borrowing capacity.',
          ],
        },
        {
          type: 'text',
          value: 'Once your position is opened, you can view it on the Dashboard page. There, you’ll see:',
        },
        {
          type: 'list',
          items: [
            'Health Factor: A measure of how safe your position is (the higher, the better).',
            'Collateral: The value of your assets in the position.',
            'Borrowed Amount: The total amount you have borrowed.'
          ],
        },
        {
          type: 'text',
          value: 'About position',
        },
        {
          type: 'list',
          items:
            [
              'If you wish to close your position, simply click on `Reedem` in the Dashboard page. This will allow you to withdraw your collateral and repay the loan.',
              'Currently, Spotnet only allows you to open a single position.',
              'If your health ratio level will be zero, you will be liquidated by ZkLend.',
              'You also have the option to enable notifications on Telegram, so you will be alerted if your health ratio reaches a dangerous level.'
            ],
        },

      ],
    },
 
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: [
        {
          type: 'text',
          value: 'Setting Up Your Wallet',
        },
        {
          type: 'orderedList',
          items: [
            'Download a compatible Web3 wallet (e.g., MetaMask).',
            'Fund your wallet with the supported cryptocurrency.',
            'Connect your wallet to [Product Name].',
          ],
        },
      ],
    },
  ];

  return (
    <div className="documentation-page">
      <TableOfContents tabelTitle={"Table Of Content"} defaultActiveId={"introduction"} headerHeight={80} items={tableOfContents} />

      <div className="main-content">
        <h1 className="main-title">Spot Documentation</h1>
        <Sections sections={sectionsData} />
      </div>

      <ScrollButton />
    </div>

  );
};

export default Documentation;