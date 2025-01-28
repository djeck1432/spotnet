import React, { useEffect } from 'react';
import ScrollButton from 'components/ui/scroll-button/ScrollButton';
import Sections from 'components/layout/sections/Sections';
import Sidebar from 'components/layout/sidebar/Sidebar';

const TermsAndConditionsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tableOfContents = [
    {
      id: 'risks',
      name: 'Risks',
      link: '#risks',
      children: [
        { id: 'smart-contract-risks', name: 'Smart Contract Risks', link: '#smart-contract-risks' },
        { id: 'market-volatility', name: 'Market Volatility', link: '#market-volatility' },
        { id: 'liquidity-risks', name: 'Liquidity Risks', link: '#liquidity-risks' },
        { id: 'third-party-integrations', name: 'Third-Party Integrations', link: '#third-party-integrations' },
      ],
    },
    { id: 'terms-and-conditions', name: 'Terms and Conditions', link: '#terms-and-conditions' },
  ];

  const sectionsData = [
    {
      id: 'risks',
      title: 'Risks',
      content: [
        {
          type: 'text',
          value:
            'Using zkLend involves certain risks. Please review and understand these risks before interacting with the platform.',
        },
        {
          type: 'orderedList',
          items: [
            'Smart Contract Risks. Transactions on [Product Name] are governed by smart contracts. Once confirmed, smart contract transactions cannot be reversed. While our contracts are thoroughly audited, there may still be unforeseen issues. Users should review contract code and understand that they are solely responsible for any losses due to contract bugs or exploits.',
            'Market Volatility. Digital assets are subject to high price volatility. Values can fluctuate significantly in a short period, potentially leading to substantial losses. Users should be cautious and only invest funds they can afford to lose.',
            'Liquidity Risks. Some DeFi pools may have low liquidity, affecting users’ ability to withdraw funds immediately. This may result in delays or loss in value due to slippage during transactions.',
            'Third-Party Integrations. zkLend may integrate with third-party protocols, dApps, or platforms. These third-party services come with their own risks, and [Product Name] is not responsible for issues arising from third-party integrations, including security vulnerabilities or loss of funds.',
            'Privacy and Security. Users are responsible for securing their private keys and wallet credentials. Loss or compromise of these credentials may result in a total loss of funds, as zkLend cannot recover lost private keys. It is advised to use a secure, trusted wallet and enable additional security measures when available.',
          ],
        },
      ],
    },
    {
      id: 'terms-and-conditions',
      title: 'Terms & Conditions',
      content: [
        {
          type: 'orderedList',
          items: [
            'Acceptance of Terms. By using [Product Name], you agree to these Terms and Conditions. If you do not agree, please refrain from using the platform.',
          ],
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen relative pt-16 text-primary">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.25)_1px,transparent_1px),radial-gradient(circle_at_15%_85%,rgba(255,255,255,.25)_1px,transparent_1px),radial-gradient(circle_at_75%_75%,rgba(255,255,255,.25)_1px,transparent_1px)] bg-[length:100px_100px] pointer-events-none z-0"></div>

      <div className="lg:ml-[370px] flex-1 bg-cover bg-center relative min-h-screen" style={{
        backgroundImage: `radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
        radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.25) 1px, transparent 1px)`
      }}>
        <Sidebar items={tableOfContents} title={'Content'} />
      </div>

      <div className="content flex-grow relative">
        <h1 className="text-5xl font-bold text-transparent bg-white bg-clip-text mt-24 mb-12 ml-10">Terms & Conditions</h1>
        <div className="ml-5">
          <Sections sections={sectionsData} />
        </div>
      </div>

      <ScrollButton />
    </div>
  );
};

export default TermsAndConditionsPage;
