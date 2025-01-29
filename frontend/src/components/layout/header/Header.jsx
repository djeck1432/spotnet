import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Logo from '@/assets/icons/spotnet-logo.svg?react';
import WalletSection from '@/components/layout/wallet-section/WalletSection';
import NavigationLinks from '@/components/layout/navigation-links/NavigationLinks';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import MobDropdownMenu from '@/components/layout/mob-dropdown-menu/MobDropdownMenu';
import '@/index.css';
import { ReportBugButton } from '@/components/report-button/ReportBugButton';
import { ReportBugModal } from '@/components/report-modal/ReportBugModal';

function Header({ onConnectWallet, onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const makeNavStick = [
    '/overview',
    '/documentation',
    '/dashboard',
    '/dashboard/position-history',
    '/dashboard/deposit',
    '/stake',
    '/dashboard/withdraw',
    '/terms-and-conditions',
    '/defispring',
  ].includes(location.pathname);

  useLockBodyScroll(isMenuOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav
        className={`flex items-center justify-center w-full h-[90px] bg-header-bg backdrop-blur-lg border-b border-[#300734] z-[9999] ${makeNavStick ? 'fixed top-0' : 'relative'}`}
      >
        <div className="flex items-center justify-between w-full px-[30px] relative">
          <div className="logo">
            <NavLink to="/">
              <img src={Logo} alt="logo" className="mt-[9px] w-[300px] h-auto" />
            </NavLink>
          </div>
          {/* desktop navigation */}
          <NavigationLinks onNavClick={handleNavClick} />
          <div className="flex items-center gap-2">
            <div className="dropdown">
              <MobDropdownMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
            <WalletSection onConnectWallet={onConnectWallet} onLogout={onLogout} />
          </div>
        </div>
      </nav>

      {!isModalOpen && <ReportBugButton onClick={openModal} />}

      {isModalOpen && <ReportBugModal onClose={closeModal} />}
    </>
  );
}

export default Header;
