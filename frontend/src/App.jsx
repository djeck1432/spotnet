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
import { logout } from 'services/wallet';
import { saveTelegramUser, getTelegramUserWalletId } from 'services/telegram';
import Documentation from 'pages/spotnet/documentation/Documentation';
import Withdraw from 'pages/vault/withdraw/Withdraw';
import { useConnectWallet } from 'hooks/useConnectWallet';
import { Notifier } from 'components/Notifier/Notifier';

function App() {
  const [walletId, setWalletId] = useState(localStorage.getItem('wallet_id'));
  const [tgUser, setTgUser] = useState(JSON.parse(localStorage.getItem('tg_user')));
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const connectWalletMutation = useConnectWallet(setWalletId);

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

  const handleConnectWallet = () => {
    connectWalletMutation.mutate();
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
  };

  return (
    <div className="App">
      <Notifier />
      {showModal && createPortal(<LogoutModal onClose={closeModal} onLogout={handleLogout} />, document.body)}
      <Header
        tgUser={tgUser}
        setTgUser={setTgUser}
        walletId={walletId}
        onConnectWallet={handleConnectWallet}
        onLogout={handleLogoutModal}
      />
      <main>
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
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/form" element={<Form walletId={walletId} setWalletId={setWalletId} />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;