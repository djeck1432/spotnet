import React from 'react';
import ArrowDownIcon from '@/assets/icons/dropdown-arrow.svg?react';
import ReloadIcon from '@/assets/icons/reload.svg?react';
import OpenBotIcon from '@/assets/icons/bot.svg?react';
import TermsIcon from '@/assets/icons/terms.svg?react';

const menuItems = [
  { id: 1, text: 'Reload page', icon: <img src={ReloadIcon} alt="relaod-icon" className="w-5 h-5 mr-2" />, link: '#' },
  { id: 2, text: 'Open Bot', icon: <img src={OpenBotIcon} alt="open-button-icon" className="w-5 h-5 mr-2" />, link: '#' },
  { id: 3, text: 'Terms of Use', icon: <img src={TermsIcon} className="w-5 h-5 mr-2" />, link: '#' },
];

function MobDropdownMenu() {
  return (
    <div className="relative">
      <button
        className="lg:hidden flex justify-center items-center p-2 border-none bg-transparent"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img src={ArrowDownIcon} alt="arrow-down-icon" className="w-5 h-5" />
      </button>
      <ul className="dropdown-menu absolute w-96 bg-primary-color/80 rounded-2xl shadow-lg p-6 top-40 left-[100%] transform -translate-x-1/2 z-50">
        {menuItems.map((item) => (
          <li key={item.id} className="mb-4 z-50">
            <a className="flex items-center p-4 bg-header-button-bg text-second-primary hover:text-white rounded-xl z-50 cursor-pointer">
              {item.icon}
              {item.text}
            </a>
          </li>
        ))}
        <li>
          <button variant="primary" size="lg" className="w-full py-3 bg-header-button-bg text-second-primary hover:text-white rounded-xl ">
            Cancel
          </button>
        </li>
      </ul>
    </div>
  );
}

export default MobDropdownMenu;
