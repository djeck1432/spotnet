import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDashboardData } from '../../../hooks/useDashboardData';
import axios from 'axios';
import Button from 'components/ui/Button/Button';
import { ReactComponent as AlertHexagon } from 'assets/icons/alert_hexagon.svg';
import Spinner from 'components/spinner/Spinner';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { positionId } = useParams();
  const { data } = useDashboardData(positionId);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`/api/add-extra-deposit/${positionId}`, {
        position_id: positionId,
        amount: parseFloat(amount),
        token_symbol: data?.tokenSymbol
      });
      
      setAmount('');
    } catch (error) {
      setError(error.response?.data?.message || 'Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {isLoading && <Spinner loading={isLoading} />}
        <h1 className="dashboard-title">Add Deposit</h1>
        
        <div className="dashboard-content">
          <div className="dashboard-info-card">
            <form onSubmit={handleDeposit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  Amount ({data?.tokenSymbol || 'ETH'})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--dark-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--second-primary)',
                    marginTop: '8px'
                  }}
                  placeholder="Enter amount"
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  Error: {error} <AlertHexagon className="form-alert-hex" />
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="dashboard-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Deposit'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
