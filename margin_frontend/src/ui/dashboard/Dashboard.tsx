
import FastTrade from './components/FastTrade';
import Holding from './components/Holding';
import MarketValue from './components/MarketValue';
import PortfolioStats from './components/PortfolioStats';
import RecentActivities from './components/RecentActivities';

const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            <h1>Dashboard Works!</h1>
            <p>This is a test dashboard.</p>
            <MarketValue />
            <PortfolioStats />
            <FastTrade />
            <Holding />
            <RecentActivities />
        </div>
    );
};

export default Dashboard;
