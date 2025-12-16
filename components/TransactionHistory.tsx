import React from 'react';
import type { Transaction } from '../types';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';

interface TransactionHistoryProps {
    history: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No transactions to display.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {history.map((tx) => {
        const isDeposit = tx.type === 'deposit';
        const formattedAmount = `${isDeposit ? '+' : '-'} $${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // A transaction is considered "recent" if it was created in the last 2 seconds.
        const isRecent = (new Date().getTime() - new Date(tx.timestamp).getTime()) < 2000;

        return (
          <li 
            key={tx.id} 
            className={`
              flex items-center justify-between bg-gray-800/60 p-3 rounded-lg 
              hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02]
              ${isRecent ? 'animate-new-transaction' : ''}
            `}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${isDeposit ? 'bg-emerald-900/50' : 'bg-red-900/50'}`}>
                {isDeposit 
                  ? <ArrowDownIcon className="w-5 h-5 text-emerald-400" /> 
                  : <ArrowUpIcon className="w-5 h-5 text-red-400" />}
              </div>
              <div>
                <p className="font-semibold text-gray-200 capitalize">{tx.type}</p>
                <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <p className={`font-semibold text-lg ${isDeposit ? 'text-emerald-400' : 'text-red-400'}`}>
              {formattedAmount}
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default TransactionHistory;