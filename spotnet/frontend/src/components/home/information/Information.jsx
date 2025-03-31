import React, { useEffect, useState } from 'react';
import StarMaker from '@/components/layout/star-maker/StarMaker';
import { axiosInstance } from '@/utils/axios';

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
    <div className="flex h-auto items-center justify-center px-[3em] md:px-[5em]">
      <div className="relative mt-[4em] flex w-[100%] max-w-6xl flex-col justify-around gap-[2em] lg:mt-[190px] lg:mb-[180px] lg:flex-row">
        <div className="shadow-card flex h-[250px] flex-col items-center justify-center rounded-[20px] border border-[var(--card-border-1)] bg-gradient-to-r from-[var(--card-bg-gradient-from)] to-[var(--card-bg-gradient-to)] p-[0.1em] text-center text-[38px] font-[600] text-white backdrop-blur-[21.09375px] lg:w-[420px]">
          <h1>TVL</h1>
          <h3
            className={
              loading
                ? 'min-h-35px font-text mt-[3px] mb-0 items-center text-center text-[35px] leading-[95%] font-[600]'
                : ''
            }
          >
            {loading ? 'Loading...' : error ? `Error: ${error}` : formatCurrency(data.total_opened_amount)}
          </h3>
        </div>
        <div className="">
          <div className="card-gradient"></div>
        </div>
        <div className="shadow-card flex h-[250px] flex-col items-center justify-center rounded-[20px] border border-[var(--card-border-1)] bg-gradient-to-r from-[var(--card-bg-gradient-from)] to-[var(--card-bg-gradient-to)] p-[0.1em] text-center text-[38px] font-[600] text-white backdrop-blur-[21.09375px] lg:w-[420px]">
          <h1>Users</h1>
          <h3
            className={
              loading
                ? 'text-brand min-h-35px font-text mt-[3px] mb-0 items-center text-center text-[35px] leading-[95%] font-[600]'
                : ''
            }
          >
            {loading ? 'Loading...' : error ? `Error: ${error}` : data.unique_users}
          </h3>
        </div>
        <StarMaker starData={starData} />
      </div>
    </div>
  );
};

export default Information;
