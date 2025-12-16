import React from 'react';
import type { Accounts } from '../types';
import PlusIcon from './icons/PlusIcon';

interface AccountListProps {
  accounts: Accounts;
  selectedAccount: string | null;
  onSelectAccount: (accountNumber: string) => void;
  onCreateClick: () => void;
}

const AccountListItem: React.FC<{
  accNum: string;
  account: Accounts[string];
  isSelected: boolean;
  onSelect: (accNum: string) => void;
}> = ({ accNum, account, isSelected, onSelect }) => {
  return (
    <li className="px-2 py-1.5">
      <button
        onClick={() => onSelect(accNum)}
        className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
          isSelected
            ? 'bg-amber-500 text-white shadow-lg scale-105'
            : 'bg-gray-800/60 hover:bg-gray-800 hover:shadow-md'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className={`font-bold ${isSelected ? 'text-white' : 'text-gray-200'}`}>
              {account.owner}
            </p>
            <p className={`text-xs ${isSelected ? 'text-amber-100' : 'text-gray-400'}`}>
              #{accNum}
            </p>
          </div>
          <div className="text-right">
            <p className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-gray-100'}`}>
              ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </button>
    </li>
  );
};


const AccountList: React.FC<AccountListProps> = ({ accounts, selectedAccount, onSelectAccount, onCreateClick }) => {
  const accountEntries = Object.entries(accounts);

  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-lg h-full flex flex-col border border-white/10 backdrop-blur-sm">
      <header className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Your Accounts</h2>
        <button 
          onClick={onCreateClick}
          className="flex items-center space-x-2 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-all duration-200 shadow-sm active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New</span>
        </button>
      </header>
      <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
        {accountEntries.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p className="font-semibold">No accounts found.</p>
            <p className="text-sm">Click "New" to get started.</p>
          </div>
        ) : (
          <ul>
            {accountEntries.map(([accNum, account]) => (
              <AccountListItem 
                key={accNum}
                accNum={accNum}
                account={account}
                isSelected={selectedAccount === accNum}
                onSelect={onSelectAccount}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccountList;