import React from 'react';
import { NavLink } from 'react-router-dom';
import TwitterIcon from '@/assets/icons/new-twitter.svg?react';
import TelegramIcon from '@/assets/icons/telegram.svg?react';
import GithubIcon from '@/assets/icons/github.svg?react';
import DashboardIcon from '@/assets/icons/dashboard-icon.svg?react';
import FormIcon from '@/assets/icons/form-icon.svg?react';

function Footer() {
  const socialLinks = [
    {
      name: 'Github',
      icon: GithubIcon,
      href: 'https://github.com/djeck1432/spotnet',
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      href: 'https://t.me/djeck_vorobey1',
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      href: 'https://x.com/SpotNet_123',
    },
  ];

  return (
    <footer className="px-20 md:px-16 sm:px-8 bg-footer-bg-color h-24 flex items-center justify-between relative z-10">
      <div className="text-white text-lg hidden lg:flex">
        <p>Copyright© Spotnet {new Date().getFullYear()}</p>
      </div>

      <nav className="lg:flex gap-4 text-white text-lg hidden">
        {[
          { path: '/documentation', label: 'Documentation' },
          { path: '/overview', label: 'Overview' },
          { path: '/terms-and-conditions', label: 'Terms & Conditions' },
          { path: '/defispring', label: 'Defi Spring Rewards' },
        ].map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? 'text-brand hover:scale-105 transition-transform' : 'text-white hover:scale-105 transition-transform'
            }
            onClick={(e) => {
              if (window.location.pathname === path) {
                e.preventDefault();
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:flex gap-6 items-center justify-center">
        {socialLinks.map(({ name, href, icon: Icon }) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
            <Icon className="w-6 h-6 transition-transform hover:scale-110" />
          </a>
        ))}
      </div>

      <div className="flex lg:hidden items-center justify-center gap-2 w-full px-4 py-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? 'text-brand font-semibold'
              : 'text-secondary hover:text-brand transition-colors'
          }
        >
          <div className="flex flex-col items-center">
            <DashboardIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Dashboard</span>
          </div>
        </NavLink>

        <div className="w-px rounded-md h-4 bg-border-color" />

        <NavLink
          to="/form"
          className={({ isActive }) =>
            isActive
              ? 'text-brand font-semibold'
              : 'text-secondary hover:text-brand transition-colors'
          }
        >
          <div className="flex flex-col items-center">
            <FormIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Form</span>
          </div>
        </NavLink>
      </div>
    </footer>
  );
}

export default Footer;
