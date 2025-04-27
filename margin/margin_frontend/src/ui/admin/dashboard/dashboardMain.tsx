import Assets from './assets';

const AdminDashboard: React.FC = () => {
  const mockAssetsData = {
    values: [15032, 11246, 8273], // Dollar values for Bitcoin, Ethereum, Solana
    labels: ['Bitcoin', 'Ethereum', 'Solana'], // Asset names
    coinValues: [0.5832112, 1.7294746, 196.9766], // Native coin amounts
    coinSymbol: ['BTC', 'ETH', 'SOL'], // Coin ticker symbols
  };
  return (
    <div className='text-white '>
      <Assets className='w-full max-w-[900px]' data={mockAssetsData} />
    </div>
  );
};

export default AdminDashboard;
