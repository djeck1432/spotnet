import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'components/ui/custom-button/Button';
import { useWalletStore } from '../../../stores/useWalletStore';

const WalletSection = ({ onConnectWallet, onLogout }) => {
  const { walletId } = useWalletStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.menu-dots')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative">
      {/* Wallet Container */}
      {(isMobile || walletId) && (
        <div className="relative" ref={menuRef}>
          {/* rendering walletId on big screens only */}
          {walletId && !isMobile && (
            <span className="text-sm font-semibold text-gray-500">{`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}</span>
          )}

          {/* three dots menu */}
          <span className="cursor-pointer w-11 h-11 text-2xl font-bold border-none rounded-full border bg-footer-divider-bg flex items-center justify-center" onClick={toggleMenu}>
            &#x22EE;
          </span>

          {/* dropdown-menu */}
          {isMenuOpen && (
            <div className="absolute top-[200%] right-[10%] transform bg-primary-color border rounded-lg shadow-lg px-4 py-3 w-80 mt-2 z-10">
              {/* Connect Wallet button for mobile screens */}
              {isMobile && !walletId && (
                <Button className="w-full" onClick={onConnectWallet}>
                  <span>Connect Wallet</span>
                </Button>
              )}

              {/* Logout is available only if walletId connected */}
              {walletId && (
                <div>
                  <div>
                    <span className="text-sm font-semibold text-gray-500">{`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}</span>
                  </div>
                  <button
                    className="w-full mt-4 bg-red-500 text-white py-2 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout();
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Connect Wallet button for big screens (outside menu) */}
      {!isMobile && !walletId && (
        <Button variant="primary" size="md" onClick={onConnectWallet}>
          <span>Connect Wallet</span>
        </Button>
      )}
    </div>
  );
};

export default WalletSection;
