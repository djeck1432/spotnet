import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { ReactComponent as TwitterIcon } from '../../../assets/icons/new-twitter.svg';
import { ReactComponent as TelegramIcon } from '../../../assets/icons/telegram.svg';
import { ReactComponent as GithubIcon } from '../../../assets/icons/github.svg';
import { ReactComponent as DashboardIcon } from '../../../assets/icons/dashboard-icon.svg';
import { ReactComponent as FormIcon } from '../../../assets/icons/form-icon.svg';

import './footer.css';

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
    <footer className="footer-container">
      <div className="footer-text">
        <p>Copyright© Spotnet {new Date().getFullYear()}</p>
      </div>
      <nav className="footer-docs">
        <NavLink
          to="/documentation"
          className={({ isActive }) => (isActive ? 'footer-link-active' : '')}
          onClick={(e) => {
            if (window.location.pathname === '/documentation') {
              e.preventDefault();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Documentation
        </NavLink>
        <NavLink
          to="/overview"
          className={({ isActive }) => (isActive ? 'footer-link-active' : '')}
          onClick={(e) => {
            if (window.location.pathname === '/overview') {
              e.preventDefault();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Overview
        </NavLink>
        <Link to="/terms">Terms & Conditions</Link>
        <Link to="/defi">Defi Spring Rewards</Link>
      </nav>
      <div className="footer-social">
        {socialLinks.map(({ name, href, icon: Icon }) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer" arial-label={name}>
            <Icon />
          </a>
        ))}
      </div>
      <div className="footer-mob-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? 'active-link footer-link-dashboard' : 'footer-link-dashboard')}
        >
          <div className="link-wrapper">
            <DashboardIcon className="footer-icon" />
            <span className="footer-links">Dashboard</span>
          </div>
        </NavLink>
        <div className="footer-mob-divider"></div>
        <NavLink
          to="/form"
          className={({ isActive }) => (isActive ? 'active-link footer-link-form' : 'footer-link-form')}
        >
          <div className="link-wrapper">
            <FormIcon className="footer-icon" />
            <span className="footer-links">Form</span>
          </div>
        </NavLink>
        {/* <div className="footer-mob-divider"></div> */}
        {/* <NavLink
          to="/stake"
          className={({ isActive }) => (isActive ? 'active-link footer-link-form' : 'footer-link-form')}
        >
          <div className="link-wrapper">
            <FormIcon className="footer-icon" />
            <span>Vault</span>
          </div>
        </NavLink> */}
        {/* <div className="footer-line"></div> */}
      </div>
    </footer>
  );
}

export default Footer;
