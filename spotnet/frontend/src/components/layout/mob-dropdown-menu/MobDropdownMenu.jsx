import React from 'react';
import ArrowDownIcon from '@/assets/icons/dropdown-arrow.svg?react';
import ReloadIcon from '@/assets/icons/reload.svg?react';
import OpenBotIcon from '@/assets/icons/bot.svg?react';
import TermsIcon from '@/assets/icons/terms.svg?react';

const menuItems = [
  {
    id: 1,
    text: 'Reload page',
    icon: <ReloadIcon className="mr-1.5 h-[18px] w-[18px] sm:mr-1.5 md:mr-2" />,
    link: '#',
  },
  { id: 2, text: 'Open Bot', icon: <OpenBotIcon className="mr-1.5 h-[18px] w-[18px] md:mr-2" />, link: '#' },
  { id: 3, text: 'Terms of Use', icon: <TermsIcon className="mr-1.5 h-[18px] w-[18px] md:mr-2" />, link: '#' },
];

function MobDropdownMenu({ isMenuOpen, toggleMenu }) {
  return (
    <div className="relative">
      <button
        className="items-center justify-center px-2 py-1 after:hidden sm:relative sm:flex sm:border-0 sm:bg-transparent sm:px-2.5"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
      >
        <ArrowDownIcon className="mr-1.5 h-[18px] w-[18px] md:mr-2" />
      </button>

      {isMenuOpen && (
        <ul
          className={`xs:-translate-y-[60%] bg-overlay xs:p-[18px] pointer-events-auto fixed !top-[280px] !left-[50%] h-[310px] w-[330px] !translate-x-[-50%] !translate-y-[-60%] border-0 p-6 px-9 text-[var(--primary)] sm:p-[18px] md:h-[368px] md:w-[390px] md:p-[18px] lg:animate-[fadeIn_0.3s_ease-in-out] @max-xs:translate-x-[-50%] @min-xs:h-[280px] @min-xs:w-[300px]`}
          aria-labelledby="dropdownMenuButton1"
        >
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                className="border-footer-divider bg-dark-purple pointer-events-auto mb-3 flex h-[50px] w-3xs items-center rounded-2xl border px-6 text-xs leading-[171%] font-semibold !transition-none sm:w-[294px] md:mb-4 md:h-[60px] md:w-[342px] md:py-4 md:text-sm"
                href={item.link}
              >
                {item.icon}
                {item.text}
              </a>
            </li>
          ))}
          <li>
            <button
              className="border-footer-divider bg-dark-purple font-text before:mask-[var(--mask-gradient)] pointer-events-auto relative z-[1] mt-[45px] mb-3 flex h-[50px] w-3xs cursor-pointer items-center justify-center rounded-2xl border bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-center text-xs leading-[171%] font-semibold text-white !transition-none before:absolute before:top-0 before:bottom-0 before:left-0 before:z-[-1] before:rounded-[16px] before:p-[1px] before:content-[''] sm:w-[294px] md:mb-4 md:h-[60px] md:w-[342px] md:px-6 md:py-4 md:text-sm"
              onClick={toggleMenu}
            >
              Cancel
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default MobDropdownMenu;
