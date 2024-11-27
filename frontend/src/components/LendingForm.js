import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenBalances, sendTransaction } from 'services/wallet';
import { notifyError } from 'utils/notification';
import { axiosInstance } from 'utils/axios';
import Button from 'components/ui/Button/Button';

const LendingForm = ({ walletId }) => {
  const navigate = useNavigate();
  const [balances, setBalances] = useState({});
  const [formData, setFormData] = useState({
    token: '',
    amount: '',
    multiplier: '',
  });
  const [transactionData, setTransactionData] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!walletId) {
      return;
    }
    try {
      const tokenBalances = await getTokenBalances(walletId);
      setBalances(tokenBalances);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      notifyError('Failed to fetch token balances. Please try again.');
    }
  }, [walletId]);

  useEffect(() => {
    if (!walletId) {
      navigate('/login');
    } else {
      fetchBalances();
    }
  }, [walletId, navigate, fetchBalances]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTransactionStatus(null);
    setTransactionData(null);

    try {
      const queryParams = new URLSearchParams({
        token: formData.token,
        amount: formData.amount,
        multiplier: formData.multiplier,
        wallet_id: walletId,
      }).toString();

      const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
      console.log('BACKENDURL', backendUrl); // Replace with your backend URL
      console.log('Query Params:', queryParams);

      const res = axiosInstance.get(`/transaction-data?${queryParams}`);
      if (res.status === 200) {
        const data = res.data;
        setTransactionData(data);
        console.log('Transaction data fetched successfully:', data);

        try {
          const txResult = await sendTransaction(data);
          setTransactionStatus('Transaction sent successfully!');
        } catch (txError) {
          console.error('Error sending transaction:', txError.response?.data);
          setTransactionStatus('Failed to send transaction. Please try again.');
        }
      } else {
        const errorData = res.response?.data;
        console.error('Failed to fetch transaction data:', errorData);
        setTransactionStatus('Failed to fetch transaction data. Please try again.');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setTransactionStatus('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Submit your lending details</h2>

      <div className="mb-3">
        {Object.entries(balances).map(([token, value]) => (
          <div key={token} id={`balance-${token}`} style={{ color: '#E5E7EB' }}>
            Balance for {token}: {value}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="token" className="form-label">
            Select Token
          </label>
          <select
            className="form-select"
            id="token"
            name="token"
            value={formData.token}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select Token
            </option>
            {Object.entries(balances).map(([token, balance]) => (
              <option key={token} value={token}>
                {token} (Balance: {balance})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Token Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="form-control"
            min="0"
            step="any"
            placeholder="Enter token amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="multiplier" className="form-label">
            Multiplier
          </label>
          <select
            className="form-select"
            id="multiplier"
            name="multiplier"
            value={formData.multiplier}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select Multiplier
            </option>
            {[2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}x
              </option>
            ))}
          </select>
        </div>

        <Button variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Submit'}
        </Button>
        <Notifier />
      </form>

      {transactionData && (
        <div className="mt-4">
          <h3>Transaction Data:</h3>
          <pre>{JSON.stringify(transactionData, null, 2)}</pre>
        </div>
      )}

      {transactionStatus && (
        <div className="mt-4">
          <h3>Transaction Status:</h3>
          <p>{transactionStatus}</p>
        </div>
      )}
    </div>
  );
};

export default LendingForm;
