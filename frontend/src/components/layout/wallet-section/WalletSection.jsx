import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'components/ui/custom-button/Button';
import { useWalletStore } from '../../../stores/useWalletStore';
import { useWalletConnection } from 'services/wallet';

const WalletSection = ({ onLogout }) => {
  const { address, connectWallet, connectors } = useWalletConnection();
  const { walletId, setWalletId } = useWalletStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const menuRef = useRef(null);

  useEffect(() => {
    if (address) {
      setWalletId(address);
    }
  }, [address, setWalletId]);
  

  const handleConnect = async (connector) => {
    try {
      await connectWallet(connector);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Connection failed:', error);
    }
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
          {walletId && !isMobile && (
            <span className="wallet-id">{`${walletId.slice(0, 4)}...${walletId.slice(-4)}`}</span>
          )}

          <span className="menu-dots" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            &#x22EE;
          </span>

          {isMenuOpen && (
            <div className="menu-dropdown">
              {isMobile && !walletId && (
                <Button className="connect-btn" onClick={() => setIsModalOpen(true)}>
                  <span>Connect Wallet</span>
                </Button>
              )}

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
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!isMobile && !walletId && (
        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          <span>Connect Wallet</span>
        </Button>
      )}

      {isModalOpen && (
        <div className="wallet-modal-overlay">
          <div className="wallet-modal-content" ref={menuRef}>
            <h2>Connect Wallet</h2>
            <div className="connector-list">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  variant="secondary"
                  onClick={() => handleConnect(connector)}
                  className="wallet-button"
                >
                  {typeof connector.icon.light === 'string' &&
                    (connector.icon.light.includes('<svg') ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: connector.icon.light,
                        }}
                      />
                    ) : (
                      <img src={connector.icon.light} alt='alt' />
                    ))}
                  {connector.id.charAt(0).toUpperCase() + connector.id.slice(1)}
                </Button>
              ))}
            </div>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSection;
