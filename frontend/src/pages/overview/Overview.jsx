import React, { useEffect } from 'react';
import ScrollButton from 'components/ui/scroll-button/ScrollButton';
import Sections from 'components/layout/sections/Sections';
import Sidebar from 'components/layout/sidebar/Sidebar';

const OverviewPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tableOfContents = [
    { id: 'welcome', name: 'Welcome', link: '#welcome' },
    {
      id: 'how-it-works',
      name: 'How it works',
      link: '#how-it-works',
      children: [
        { id: 'connect-wallet', name: 'Connect Your Wallet', link: '#connect-wallet' },
        { id: 'choose-service', name: 'Choose A Service', link: '#choose-service' },
        { id: 'transact-seamlessly', name: 'Transact Seamlessly', link: '#transact-seamlessly' },
      ],
    },
    { id: 'supported-chains', name: 'Supported Chains', link: '#supported-chains' },
  ];

  const sectionsData = [
    {
      id: 'welcome',
      title: 'Welcome',
      content: [
        {
          type: 'text',
          value:
            'Welcome to Spotnet, the decentralized platform designed to empower you with seamless access to the Web3 ecosystem. Built on blockchain technology, Spotnet provides a secure, transparent, and user-friendly experience for managing your digital assets, accessing decentralized finance (DeFi) services, and engaging with the broader Web3 community.',
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
            'Connect Your Wallet: Use any Web3-compatible wallet, such as MetaMask, to connect to Spotnet securely and begin exploring the platform.',
            'Choose A Service: Select from the various DeFi services, asset management tools, and community engagement features.',
            'Transact Seamlessly: Every transaction is processed transparently on-chain, giving you control and visibility over your digital activities.',
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-start justify-center bg-gray-900 text-white">
      <div className="w-full lg:w-[374px] flex-shrink-0 bg-gray-800 border-r border-gray-700">
        <Sidebar items={tableOfContents} title="Overview" />
      </div>

      <div className="flex-1 px-6 py-10 lg:ml-[390px]">
        <h1 className="text-4xl font-semibold mb-6">Overview</h1>
        <div className="mb-12">
          <Sections sections={sectionsData} />
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <ScrollButton />
      </div>
    </div>
  );
};

export default OverviewPage;
