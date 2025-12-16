import React, { useState, useEffect } from 'react';
import type { Account } from '../types';
import CodeViewer from './CodeViewer';
import UserIcon from './icons/UserIcon';
import TrashIcon from './icons/TrashIcon';
import ClockIcon from './icons/ClockIcon';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';

interface AccountDetailsProps {
  account: (Account & { id: string });
  onDeposit: (accNum: string, amount: number) => void;
  onWithdraw: (accNum: string, amount: number) => void;
  onCloseAccountRequest: (accNum: string) => void;
  isLoading: boolean;
  lastOperationCode: string;
  error: string | null;
  clearError: () => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ account, onDeposit, onWithdraw, onCloseAccountRequest, isLoading, lastOperationCode, error, clearError }) => {
  const [balanceKey, setBalanceKey] = useState(0);

  useEffect(() => {
    // This effect triggers the balance animation by changing the key
    setBalanceKey(prev => prev + 1);
  }, [account.balance]);

  useEffect(() => {
    // Clear errors when the account context changes
    return () => {
      clearError();
    };
  }, [account.id, clearError]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-lg h-full flex flex-col border border-white/10 backdrop-blur-sm">
      <header className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-900/50 rounded-full border border-amber-500/20">
              <UserIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{account.owner}</h2>
              <p className="text-sm text-gray-400">Account #{account.id} &bull; Opened: {formatDate(account.createdAt)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 mb-6 text-center shadow-2xl">
          <p className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Current Balance</p>
          <p key={balanceKey} className="text-5xl font-bold text-white tracking-wide animate-balance-bounce-glow">
            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {error && (
            <div className="bg-red-900/50 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative mb-4" role="alert">
                <div className="pr-8">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
                <button onClick={clearError} className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 rounded-full text-red-300/70 hover:bg-red-800/50 hover:text-red-200 transition-colors" aria-label="Dismiss error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <TransactionForm 
            accountId={account.id}
            type="deposit" 
            onSubmit={(amount) => onDeposit(account.id, amount)} 
            isLoading={isLoading} 
          />
          <TransactionForm 
            accountId={account.id}
            type="withdraw" 
            onSubmit={(amount) => onWithdraw(account.id, amount)} 
            isLoading={isLoading} 
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-200">Transaction History</h3>
          </div>
          <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
             <TransactionHistory history={account.history} />
          </div>
        </div>
        
        {lastOperationCode && <CodeViewer code={lastOperationCode} />}

        <div className="flex-grow"></div>

        <div className="mt-8 pt-6 border-t border-red-500/20">
            <h3 className="text-md font-bold text-red-400 mb-2">Danger Zone</h3>
            <div className="bg-red-900/20 p-4 rounded-lg flex items-center justify-between border border-red-500/20">
                <div>
                    <p className="font-semibold text-red-200">Close this account</p>
                    <p className="text-sm text-red-400/80">Once closed, an account and its history cannot be recovered.</p>
                </div>
                <button 
                    onClick={() => onCloseAccountRequest(account.id)}
                    className="bg-red-600 text-white font-bold text-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors active:scale-95 disabled:bg-red-800 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    <TrashIcon className="w-4 h-4" />
                    <span>Close Account</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;