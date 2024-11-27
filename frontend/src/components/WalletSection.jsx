import React, { useState, useEffect, useRef } from 'react';
import Button from 'components/ui/Button/Button';

const WalletSection = ({ walletId, onConnectWallet, onLogout }) => {
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
    <div className="wallet-section">
      {/* Wallet Container */}
      {(isMobile || walletId) && (
        <div className="wallet-container" ref={menuRef}>
          {/* rendering walletId on big screens only */}
          {walletId && !isMobile && (
            <span className="wallet-id">{`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}</span>
          )}

          {/* three dots menu */}
          <span className="menu-dots" onClick={toggleMenu}>
            &#x22EE;
          </span>

          {/* dropdown-menu */}
          {isMenuOpen && (
            <div className="menu-dropdown">
              {/* Connect Wallet button for mob screens */}
              {isMobile && !walletId && (
                <Button variant="primary" size="sm" onClick={onConnectWallet}>
                  <span>Connect Wallet</span>
                </Button>
              )}

              {/* Logout is available only if walletId connected */}
              {walletId && (
                <div>
                  <div>
                    <span className="wallet-id">{`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}</span>
                  </div>
                  <button
                    className="logout-button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout();
                    }}
                  >
                    Log out
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
