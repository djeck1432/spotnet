import React, { useEffect } from 'react';
import ScrollButton from 'components/ui/scroll-button/ScrollButton';
import Sections from 'components/layout/sections/Sections';
import Sidebar from 'components/layout/sidebar/Sidebar';

export const DefiSpringPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tableOfContents = [
    { id: 'Introduction', name: 'Introduction', link: '#introduction' },
    {
      id: 'overview',
      name: 'Program overview',
      link: '#overview',
    },
    { id: 'claiming-rewards', name: 'Claiming rewards', link: '#claiming-rewards' },
    { id: 'important-notes', name: 'Important notes', link: '#important-notes' },
    { id: 'maximize-your-profit', name: 'Maximize your profit', link: '#maximize-your-profit' },
    { id: 'hub-2', name: 'The Hub And Zones', link: '#hub-2' },
    { id: 'hub-3', name: 'The Hub And Zones', link: '#hub-3' },
    { id: 'hub-4', name: 'The Hub And Zones', link: '#hub-4' },
    { id: 'hub-5', name: 'The Hub And Zones', link: '#hub-5' },
  ];

  const sectionsData = [
    {
      id: 'Introduction',
      title: 'introduction',
      content: [
        {
          type: 'text',
          value:
            'Welcome to the DeFi Spring Program!\nWhere you can earn rewards through the zkLend protocol. As part of this initiative, participants will have the opportunity to receive STRK token rewards for engaging with the platform. Here’s everything you need to know to get started and make the most of your participation.',
        },
      ],
    },
    {
      id: 'overview',
      title: 'Program Overview',
      content: [
        {
          type: 'list',
          items: [
            'Start Date: March 14, 2024, at 00:00 UTC.',
            'Duration: 6-8 months.',
            'Eligibility: Open to everyone!.',
            'Reward APR: The approximate $STRK rewards APR will be displayed next to eligible supply and borrow pools, in addition to the base interest rate.',
          ],
        },
      ],
    },
    {
      id: 'claiming-rewards',
      title: 'Claiming rewards',
      content: [
        {
          type: 'list',
          items: [
            'Reward Phases: Rewards are earned in phases, each lasting from Thursday to Wednesday. After each phase ends, it will take about 1 day for the rewards to be claimable.',
            'Reward Claims: Rewards can be claimed via zkLend Rewards.',
            'Accrued Rewards: The total rewards earned will be visible at the end of the program. You can claim your rewards all at once at that time.',
            'Final Claim Deadline: Be sure to claim your rewards before the DeFi Spring program ends. Any unclaimed rewards will be returned to the Starknet Foundation.',
          ],
        },
      ],
    },

    {
      id: 'important-notes',
      title: 'Important notes',
      content: [
        {
          type: 'list',
          items: [
            'Dynamic APRs: The APRs (Annual Percentage Rates) are updated daily based on market conditions, pool sizes, and allocations from the Starknet Foundation. These rates may change throughout the program.',
            'Incentive Strategy: Different actions, such as depositing or borrowing, may receive varying rewards depending on market dynamics',
            'Recursive Borrow Adjustment: Rewards are based on your net deposit after accounting for borrowed funds. For example, if you deposit 100 ETH and borrow 50 ETH, your net deposit is considered 50 ETH. Recursive borrowers will see a higher APR than what they ultimately claim.',
            'Stablecoin Considerations: From Phase 3 onward, stablecoins (USDC, USDT, DAI) will be treated as the same asset for reward calculations. Your eligible net deposit for these will be calculated as the value of stablecoins deposited minus the value of stablecoins borrowed.',
          ],
        },
      ],
    },

    {
      id: 'maximize-your-profit',
      title: 'Maximize your profit',
      content: [
        {
          type: 'text',
          value:
            'By participating in the DeFi Spring program, you can leverage your assets and earn additional rewards, contributing to a more liquid and dynamic DeFi ecosystem. Keep an eye on your rewards as you participate, and make the most out of the program!',
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen relative pt-1">
      <Sidebar title="Content" items={tableOfContents} />

      <div
        className="flex-1 bg-cover bg-center bg-no-repeat relative min-h-screen px-7 md:px-4 py-6 md:py-10"
        style={{
          backgroundImage: `radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
    radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
        }}
      >
        <h1 className="text-white text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-800 to-black md:text-3xl md:mb-8 ml-10">
          DeFi Spring Documentation
        </h1>
        <Sections sections={sectionsData} />
      </div>

      <ScrollButton />
    </div>
  );
};
