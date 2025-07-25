import React from 'react';
import Card from '../../components/Card';
import { DollarSign, Wallet } from 'lucide-react';

const mockData = {
  netValue: 45512.72,
  coinsValue: 34551.4,
  cashBalance: 10961.32,
};

const AccountValuesCard: React.FC = () => (
  <Card className="p-8 max-w-md w-full bg-white text-gray-900 border border-gray-200 shadow-xl">
    <div className="mb-6">
      <div className="text-2xl font-semibold mb-2 text-gray-800">Account Values</div>
      <div className="text-gray-500 text-lg mb-1">Net Value</div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{mockData.netValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-base font-medium text-gray-500">USD</span></div>
    </div>
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="bg-blue-100 p-2 rounded-lg"><DollarSign className="text-blue-500 w-6 h-6" /></span>
        <span className="text-gray-500 text-base font-medium">Coins value</span>
        <span className="ml-auto text-lg font-semibold text-gray-900">{mockData.coinsValue.toLocaleString('en-US', { minimumFractionDigits: 1 })} <span className="text-xs font-medium text-gray-500">USD</span></span>
      </div>
      <div className="flex items-center gap-3">
        <span className="bg-green-100 p-2 rounded-lg"><Wallet className="text-green-500 w-6 h-6" /></span>
        <span className="text-gray-500 text-base font-medium">Cash Balance</span>
        <span className="ml-auto text-lg font-semibold text-gray-900">{mockData.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs font-medium text-gray-500">USD</span></span>
      </div>
    </div>
  </Card>
);

export default AccountValuesCard; 