import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { ReactComponent as Logo } from '../../../assets/icons/spotnet-logo.svg';
import WalletSection from '../wallet-section/WalletSection';
import NavigationLinks from '../navigation-links/NavigationLinks';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import MobDropdownMenu from '../mob-dropdown-menu/MobDropdownMenu';
import './header.css';
import '../../../globals.css';


function Header({ onConnectWallet, onLogout }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Getting object of currant route

  const makeNavStick = location.pathname === "/overview" || location.pathname === "/documentation"

  // Blocking screen scroll if menu is open
  useLockBodyScroll(isMenuOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Closing menu is case route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Closing menu in case of screen size change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={makeNavStick ? "header-nav-sticky" : "header-nav"}>
      <div className="list-items">
        <div className="logo">
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>
        {/* desktop navigation */}
        <NavigationLinks onNavClick={handleNavClick} />
        <div className="menu-section">
          <div className="dropdown">
            <MobDropdownMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>
          <WalletSection onConnectWallet={onConnectWallet} onLogout={onLogout} />
        </div>
      </div>
    </nav>
  );
}

export default Header;
