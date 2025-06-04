import React from 'react';
import Card from '../../components/Card';

const stats = [
  { label: 'Users', value: 1200 },
  { label: 'Opened Positions', value: 340 },
  { label: 'Liquidated Positions', value: 45 },
  { label: 'Opened Orders', value: 210 },
];

const DashboardStats: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat) => (
      <Card key={stat.label} className="p-6 flex flex-col items-center text-center">
        <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
        <div className="text-lg text-gray-400 font-medium">{stat.label}</div>
      </Card>
    ))}
  </div>
);

export default DashboardStats; 