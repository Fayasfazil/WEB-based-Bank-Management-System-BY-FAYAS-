import React, { useMemo } from 'react';
import type { Accounts } from '../types';
import PlusIcon from './icons/PlusIcon';
import FayasBankIcon from './icons/FayasBankIcon';

interface DashboardProps {
  accounts: Accounts;
  onCreateClick: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-white/10 transition-all duration-300 hover:bg-gray-800 hover:border-white/20 hover:scale-105">
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ accounts, onCreateClick }) => {
    const { totalAccounts, totalBalance } = useMemo(() => {
        const accountEntries = Object.values(accounts);
        const totalBalance = accountEntries.reduce((sum, acc) => sum + acc.balance, 0);
        return {
            totalAccounts: accountEntries.length,
            totalBalance: totalBalance,
        };
    }, [accounts]);

    const formattedTotalBalance = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="bg-gray-800/50 rounded-2xl shadow-lg h-full flex flex-col justify-center items-center p-6 text-center border border-white/10 backdrop-blur-sm">
            <div className="p-4 bg-gray-900 rounded-full mb-4 border border-amber-500/20 shadow-lg">
                 <FayasBankIcon className="w-12 h-12 text-amber-400" />
            </div>
           
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to FAYAS Bank</h2>
            <p className="text-gray-400 max-w-md mb-8">
                Select an account from the list to manage it, or create a new one to get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-2xl">
                <StatCard title="Total Accounts" value={totalAccounts} />
                <StatCard title="Aggregated Balance" value={formattedTotalBalance} />
            </div>
            
            <button 
              onClick={onCreateClick}
              className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Your First Account</span>
            </button>
        </div>
    );
};

export default Dashboard;