import React from 'react';
import Button from 'components/ui/Button/Button';

function Login({ onConnectWallet }) {
  return (
    <div className="form-container">
      <h2>Connect Your Wallet</h2>
      <Button variant="primary" size="md" onClick={onConnectWallet}>
        <span>Connect Wallet</span>
      </Button>
    </div>
  );
}

export default Login;
