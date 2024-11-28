import React from 'react';
import { ReactComponent as ArrowDownIcon } from '../../assets/icons/dropdown-arrow.svg';
import { ReactComponent as ReloadIcon } from '../../assets/icons/reload.svg';
import { ReactComponent as OpenBotIcon } from '../../assets/icons/bot.svg';
import { ReactComponent as TermsIcon } from '../../assets/icons/terms.svg';
import './mobDropdownMenu.css';

const menuItems = [
  { id: 1, text: 'Reload page', icon: <ReloadIcon className="dpd-icon" />, link: '#' },
  { id: 2, text: 'Open Bot', icon: <OpenBotIcon className="dpd-icon" />, link: '#' },
  { id: 3, text: 'Terms of Use', icon: <TermsIcon className="dpd-icon" />, link: '#' },
];

function MobDropdownMenu() {
  return (
    <div className="mob-dpd-menu">
      <button
        className="dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <ArrowDownIcon className="dpd-icon" />
      </button>
      <ul className="dropdown-menu dropdown-items " aria-labelledby="dropdownMenuButton1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <a className="dropdown-item" href={item.link}>
              {item.icon}
              {item.text}
            </a>
          </li>
        ))}
        <li>
          <button className="dropdown-item cancel-btn">Cancel</button>
        </li>
      </ul>
    </div>
  );
}

export default MobDropdownMenu;
