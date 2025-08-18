import React from 'react';
import Card from '../../components/Card';
import { useDashboardStatistics } from '../../../services/dashboardServices';

const DashboardStats: React.FC = () => {
  const { data: statistics, isLoading, isError } = useDashboardStatistics();

  if (isError) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 flex flex-col items-center text-center col-span-full">
          <div className="text-lg text-red-400 font-medium">Failed to load dashboard statistics</div>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: 'Users', value: statistics?.users ?? 0 },
    { label: 'Opened Positions', value: statistics?.opened_positions ?? 0 },
    { label: 'Liquidated Positions', value: statistics?.liquidated_positions ?? 0 },
    { label: 'Opened Orders', value: statistics?.opened_orders ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 flex flex-col items-center text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {isLoading ? '...' : stat.value.toLocaleString()}
          </div>
          <div className="text-lg text-gray-400 font-medium">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats; 