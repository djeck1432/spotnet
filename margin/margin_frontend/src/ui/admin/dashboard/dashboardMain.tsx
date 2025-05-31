import Assets from './assets';
import AdminLayout from '../AdminLayout';
import DashboardStats from './DashboardStats';
import AccountValuesCard from './AccountValuesCard';

const AdminDashboard: React.FC = () => {
  const mockAssetsData = {
    values: [15032, 11246, 8273],
    labels: ['Bitcoin', 'Ethereum', 'Solana'],
    coinValues: [0.5832112, 1.7294746, 196.9766],
    coinSymbol: ['BTC', 'ETH', 'SOL'],
  };
  return (
    <AdminLayout>
      <div className='text-white flex flex-col items-center gap-8'>
        <AccountValuesCard />
        <DashboardStats />
        <Assets className='w-full max-w-[900px]' data={mockAssetsData} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
