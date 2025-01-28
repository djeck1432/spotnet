import React from 'react';
import { ReactComponent as ArrowDownIcon } from '../../../assets/icons/dropdown-arrow.svg';
import { ReactComponent as ReloadIcon } from '../../../assets/icons/reload.svg';
import { ReactComponent as OpenBotIcon } from '../../../assets/icons/bot.svg';
import { ReactComponent as TermsIcon } from '../../../assets/icons/terms.svg';

const menuItems = [
  { id: 1, text: 'Reload page', icon: <ReloadIcon className="w-5 h-5 mr-2" />, link: '#' },
  { id: 2, text: 'Open Bot', icon: <OpenBotIcon className="w-5 h-5 mr-2" />, link: '#' },
  { id: 3, text: 'Terms of Use', icon: <TermsIcon className="w-5 h-5 mr-2" />, link: '#' },
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
        <ArrowDownIcon className="w-5 h-5" />
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
