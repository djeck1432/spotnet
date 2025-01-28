import React, { useEffect, useState } from 'react';
import StarMaker from '../../layout/star-maker/StarMaker';
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
    { top: 30, left: 39, size: 15 },
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
    <div className="flex items-center justify-center">
      <div className="relative w-full max-w-6xl flex justify-around mt-48 mb-36">
        <div className="flex flex-col items-center justify-center gap-4 w-64 md:w-96 h-52  bg-card-bg-gradient rounded-2xl border-x border-y border-border-gradient shadow-lg backdrop-blur-lg text-white">
          <h1 className="text-xl font-semibold text-center text-second-primary">TVL</h1>
          <h3 className={`text-2xl font-bold text-center ${loading ? 'animate-pulse' : ''}`}>
            {loading ? 'Loading...' : error ? `Error: ${error}` : formatCurrency(data.total_opened_amount)}
          </h3>
        </div>

        <div className="absolute top-20 left-[-330px] w-56 h-52 rounded-full bg-blue-pink-gradient-alt blur-3xl"></div>
        <div className="absolute bottom-20 right-[-450px] w-96 h-52 rounded-full bbg-blue-pink-gradient-alt2 blur-3xl"></div>

        <div className="flex flex-col items-center justify-center gap-4 w-64 md:w-96 h-52 bg-card-bg-gradient rounded-2xl border-x border-y border-border-gradient shadow-lg backdrop-blur-lg text-white">
          <h1 className="text-xl font-semibold text-center text-second-primary">Users</h1>
          <h3 className={`text-2xl font-bold text-center ${loading ? 'animate-pulse' : ''}`}>
            {loading ? 'Loading...' : error ? `Error: ${error}` : data.unique_users}
          </h3>
        </div>
        <StarMaker starData={starData} />
      </div>
    </div>
  );
};

export default Information;
