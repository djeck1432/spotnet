import React, { useEffect } from 'react';
import './documentation.css';
import TableOfContents from '../../components/table-of-content/TableOfContents';
import ScrollButton from '../../components/ui/scroll-button/ScrollButton';
import Sections from 'components/layout/sections/Sections';

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
    { title: 'Getting Started', link: '#getting-started' },
    { title: 'Features Overview', link: '#features' },
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
            'Welcome to [Product Name] Documentation\n[Product Name] is a decentralized platform designed to [describe purpose, e.g., "empower users to securely manage digital assets and access DeFi tools effortlessly"]. This documentation provides a comprehensive guide on using [Product Name] and making the most of its features.',
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
        <h1 className="main-title">zkLend Documentation</h1>
          <Sections sections={sectionsData} />
      </div>

      <ScrollButton />
    </div>

  );
};

export default Documentation;