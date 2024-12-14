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
import { logout } from 'services/wallet';
import { saveTelegramUser, getTelegramUserWalletId } from 'services/telegram';
import Documentation from 'pages/spotnet/documentation/Documentation';
import Withdraw from 'pages/vault/withdraw/Withdraw';
import { useWalletStore } from 'stores/useWalletStore';
import { Notifier } from 'components/Notifier/Notifier';
import { useConnectWallet } from 'hooks/useConnectWallet';
import OverviewPage from 'pages/spotnet/overview/Overview';
import { ActionModal } from 'components/ui/ActionModal';
import Stake from 'pages/vault/stake/Stake';
import History from 'pages/spotnet/history/History';

function App() {
  const { walletId, setWalletId, removeWalletId } = useWalletStore();
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
  }, [tgUser, walletId, setWalletId]);

  const handleConnectWallet = () => {
    connectWalletMutation.mutate();
  };

  const handleLogout = () => {
    logout();
    removeWalletId();
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
      {showModal &&
        createPortal(
          <ActionModal
            isOpen={showModal}
            title="Logout"
            subTitle={'Do you want to disconnect your wallet and logout of this account?'}
            cancelLabel="Cancel"
            submitLabel="Yes, logout"
            submitAction={handleLogout}
            cancelAction={closeModal}
          />,
          document.body
        )}
      <Header
        tgUser={tgUser}
        setTgUser={setTgUser}
        onConnectWallet={handleConnectWallet}
        onLogout={handleLogoutModal}
      />
      <main>
        <Routes>
          <Route index element={<SpotnetApp onConnectWallet={handleConnectWallet} onLogout={handleLogout} />} />
          <Route
            path="/login"
            element={walletId ? <Navigate to="/" /> : <Login onConnectWallet={handleConnectWallet} />}
          />
          <Route path="/dashboard" element={<Dashboard telegramId={tgUser} />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/form" element={<Form />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/history" element={<History />} />
          <Route path="/stake" element={<Stake />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
