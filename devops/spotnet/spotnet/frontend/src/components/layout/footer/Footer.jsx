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
    <footer className="text-primary relative flex h-[70px] w-full items-center bg-[var(--footer-bg-color)] px-[15px] md:h-[100px] md:px-[80px]">
      <div className="hidden w-full items-center justify-between lg:flex">
        <div className="text-base">
          <p className="m-0">Copyright©Spotnet2024</p>
        </div>
        <nav className="flex items-center">
          {[
            { path: '/documentation', label: 'Documentation' },
            { path: '/overview', label: 'Overview' },
            { path: '/terms-and-conditions', label: 'Terms & Conditions' },
            { path: '/defispring', label: 'Defi Spring Rewards' },
          ].map((link, index, array) => (
            <React.Fragment key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `inline-block text-base transition-all duration-300 ease-in-out hover:scale-110 hover:text-[var(--brand)] ${isActive ? 'text-[var(--brand)]' : ''} `
                }
                onClick={(e) => {
                  if (window.location.pathname === link.path) {
                    e.preventDefault();
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {link.label}
              </NavLink>
              {index < array.length - 1 && <div className="mx-4 h-4 w-[1px] rounded-full bg-gray-600 opacity-40" />}
            </React.Fragment>
          ))}
        </nav>
        <div className="flex items-center">
          {socialLinks.map(({ name, href, icon: Icon }, index, array) => (
            <React.Fragment key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="text-gray-400 transition-all duration-300 hover:scale-110 hover:text-[var(--nav-button-hover)]"
              >
                <Icon className="h-5 w-5" />
              </a>
              {index < array.length - 1 && <div className="mx-4 h-4 w-[1px] rounded-full bg-gray-600 opacity-40" />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="relative flex w-full items-center justify-center gap-[60px] p-4 sm:gap-10 lg:hidden">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `inline-block text-sm font-normal text-gray-400 transition-all duration-300 ease-in-out ${isActive ? 'font-semibold text-[var(--brand)]' : 'hover:text-[var(--brand)]'} `
          }
        >
          <div className="flex flex-col items-center">
            <DashboardIcon className="mb-[3px] h-5 w-5" />
            <span className="w-20 text-center">Dashboard</span>
          </div>
        </NavLink>

        <div className="relative z-[1] m-0 h-4 w-[1px] flex-shrink-0 transform-gpu rounded-lg bg-gray-600 opacity-40" />

        <NavLink
          to="/form"
          className={({ isActive }) =>
            `inline-block text-sm font-normal text-gray-400 transition-all duration-300 ease-in-out ${isActive ? 'font-semibold text-[var(--brand)]' : 'hover:text-[var(--brand)]'} `
          }
        >
          <div className="flex flex-col items-center">
            <FormIcon className="mb-[3px] h-5 w-5" />
            <span className="w-20 text-center">Form</span>
          </div>
        </NavLink>

        <div className="absolute top-0 left-0 h-[1px] w-full transition-colors duration-300" />
      </div>
    </footer>
  );
}

export default Footer;
