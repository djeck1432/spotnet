import React from 'react';
import Button from 'components/ui/Button/Button';

function Login({ onConnectWallet }) {
  return (
    <div className="form-container">
      <h2>Connect Your Wallet</h2>
      <Button variant="secondary" size="md" onClick={onConnectWallet}>
        Connect Wallet
      </Button>
    </div>
  );
}

export default Login;
