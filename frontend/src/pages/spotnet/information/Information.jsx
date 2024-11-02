import './information.css';
import React, { useEffect, useState } from "react";
import StarMaker from "../../../components/StarMaker"; 
import { axiosInstance } from 'utils/axios';

const Information = () => {
  const [data, setData] = useState({ total_opened_amount: 0, unique_users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/api/get_stats`);
                setData({
                    total_opened_amount: response.data.total_opened_amount,
                    unique_users: response.data.unique_users,
                });
            } catch (error) {
                setError(error.response ? error.response.data.message : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

  const starData = [
    { top: 9, left: -6.2, size: 20 },
    { top: 9, left: 39, size: 15 },
    { top: -8, left: 85, size: 18 },
    { top: 74, left: 43, size: 22 },
  ];

  const formatCurrency = (value) => {
    if (value < 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 1,
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="information">
      <div className="card-info__container">
        <div className="card-info flex">
          <h1>TVL</h1>
          <h3>{loading ? 'Loading...' : error ? `Error: ${error}` : formatCurrency(data.total_opened_amount)}</h3>
        </div>
        <div className="infos">
          <div className="card-gradient"></div>
          <div className="card-gradient"></div>
        </div>
        <div className="card-info flex">
          <h1>Users</h1>
          <h3>{loading ? 'Loading...' : error ? `Error: ${error}` : data.unique_users}</h3>
        </div>
        <StarMaker starData={starData} />
      </div>
    </div>
  );
};

export default Information;
