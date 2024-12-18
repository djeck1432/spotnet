import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDashboardData = (positionId) => {
  const [position, setPosition] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming you have an endpoint to fetch position details
        const response = await axios.get(`/api/positions/${positionId}`);
        setPosition(response.data);
        setTokenSymbol(response.data.token_symbol);
      } catch (error) {
        console.error('Failed to fetch position data:', error);
      }
    };

    if (positionId) {
      fetchData();
    }
  }, [positionId]);

  return { position, tokenSymbol };
};