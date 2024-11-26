import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './globals.css';
import Header from './components/header/Header';
import Dashboard from 'pages/spotnet/dashboard/Dashboard';
import Footer from './components/Footer/Footer';
import SpotnetApp from 'pages/spotnet/spotnet_app/SpotnetApp';
import Login from 'pages/Login';
import Form from 'pages/forms/Form';
import { createPortal } from 'react-dom';
import LogoutModal from './components/Logout/LogoutModal';
import { connectWallet, logout, checkForCRMToken } from 'services/wallet';
import { saveTelegramUser, getTelegramUserWalletId } from 'services/telegram';
import Documentation from 'pages/spotnet/documentation/Documentation';
import Vault from 'pages/spotnet/Vault/Vault';

function App() {
  const [walletId, setWalletId] = useState(localStorage.getItem('wallet_id'));
  const [tgUser, setTgUser] = useState(JSON.parse(localStorage.getItem('tg_user')));
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tgUser) {
      saveTelegramUser(tgUser, walletId)
        .then(() => console.log('Telegram user saved successfully'))
        .catch((error) => console.error('Error saving Telegram user:', error));
    }
    if (!walletId) {
      localStorage.removeItem('wallet_id');
      return;
    }
    localStorage.setItem('wallet_id', walletId);
  }, [walletId, tgUser]);

  useEffect(() => {
    if (!tgUser) {
      localStorage.removeItem('tg_user');
      return;
    }
    if (!walletId) {
      getTelegramUserWalletId(tgUser)
        .then((fetchedWalletId) => {
          if (fetchedWalletId) {
            setWalletId(fetchedWalletId);
          }
        })
        .catch((error) => console.error('Error fetching wallet ID:', error));
      localStorage.setItem('tg_user', JSON.stringify(tgUser));
    }
  }, [tgUser, walletId]);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      const walletAddress = await connectWallet();
  
      if (!walletAddress) {
        throw new Error('Failed to connect wallet');
      }
  
      const hasCRMToken = await checkForCRMToken(walletAddress);
      if (!hasCRMToken) {
        return; // Stop further actions if wallet doesn't have CRM token
      }
  
      setWalletId(walletAddress);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setWalletId(null);
    closeModal();
    navigate('/');
  };

  const handleLogoutModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <div className="App">
      {showModal && createPortal(<LogoutModal onClose={closeModal} onLogout={handleLogout} />, document.body)}
      <Header
        tgUser={tgUser}
        setTgUser={setTgUser}
        walletId={walletId}
        onConnectWallet={handleConnectWallet}
        onLogout={handleLogoutModal}
        />
      <main>
      
        {error && <div className="alert alert-danger">{error}</div>}
        <Routes>
          <Route
            index
            element={<SpotnetApp walletId={walletId} onConnectWallet={handleConnectWallet} onLogout={handleLogout} />}
          />
          <Route
            path="/login"
            element={walletId ? <Navigate to="/" /> : <Login onConnectWallet={handleConnectWallet} />}
          />
          <Route path="/dashboard" element={<Dashboard walletId={walletId} telegramId={tgUser} />} />
          <Route path="/form" element={<Form walletId={walletId} setWalletId={setWalletId} />} />
          <Route path="/documentation" element={<Documentation/>} />
          <Route path="/vault" element={<Vault/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
