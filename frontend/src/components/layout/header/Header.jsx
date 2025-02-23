import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useNavigate } from '@tanstack/react-router'; 
import Logo from '@/assets/icons/spotnet-logo.svg';
import WalletSection from '@/components/layout/wallet-section/WalletSection';
import NavigationLinks from '@/components/layout/navigation-links/NavigationLinks';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import MobDropdownMenu from '@/components/layout/mob-dropdown-menu/MobDropdownMenu';
import { ReportBugButton } from '@/components/report-button/ReportBugButton';
import { ReportBugModal } from '@/components/report-modal/ReportBugModal';

const STICKY_ROUTES = [
  '/overview',
  '/documentation',
  '/dashboard',
  '/dashboard/position-history',
  '/dashboard/deposit',
  '/stake',
  '/dashboard/withdraw',
  '/terms-and-conditions',
  '/defispring',
  
];

const useMenuHandling = (pathname) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMenuOpen,
    toggleMenu: () => setIsMenuOpen(!isMenuOpen),
    closeMenu: () => setIsMenuOpen(false),
  };
};

const useModalHandling = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return {
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
  };
};

const Navigation = ({ makeNavStick, children }) => (
  <nav
    className={
      makeNavStick
        ? 'bg-header-bg fixed z-[100] flex h-[90px] w-full items-center justify-center border-b border-[var(--deep-purple)] whitespace-nowrap'
        : 'bg-header-bg relative z-[9999] flex h-[90px] w-full items-center justify-center border-b border-[var(--deep-purple)] whitespace-nowrap'
    }
  >
    {children}
  </nav>
);

const LogoSection = () => (
  <div>
    <NavLink to="/">
      <img
        src={Logo}
        className="mt-[9px] h-auto sm:w-[230px] md:h-auto md:w-[250px] lg:h-auto lg:w-[300px] @max-xs:w-[200px]"
      />
    </NavLink>
  </div>
);

function Header({ onConnectWallet, onLogout }) {
  const location = useLocation();
  const makeNavStick = STICKY_ROUTES.includes(location.pathname);
  

  const { isMenuOpen, toggleMenu, closeMenu } = useMenuHandling(location.pathname);
  const { isModalOpen, openModal, closeModal } = useModalHandling();

  useLockBodyScroll(isMenuOpen);

  return (
    <>
      <Navigation makeNavStick={makeNavStick}>
        <div className="relative flex w-full items-center justify-between bg-transparent px-[30px]">
          <LogoSection />

         
          <NavigationLinks onNavClick={closeMenu} />

          <div className="flex items-center">
            <div className="relative block lg:hidden">
              <MobDropdownMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
            <WalletSection onConnectWallet={onConnectWallet} onLogout={onLogout} />
          </div>
        </div>
      </Navigation>

      {!isModalOpen && <ReportBugButton onClick={openModal} />}
      {isModalOpen && <ReportBugModal onClose={closeModal} />}
    </>
  );
}

export default Header;
