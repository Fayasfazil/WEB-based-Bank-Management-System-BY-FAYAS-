import React, { useState } from 'react';
import { useFormAutoSave } from '../hooks/useFormAutoSave';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import RestoreIcon from './icons/RestoreIcon';

interface TransactionFormProps {
  accountId: string;
  type: 'deposit' | 'withdraw';
  onSubmit: (amount: number) => void;
  isLoading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ accountId, type, onSubmit, isLoading }) => {
  const [amount, setAmount] = useState('');
  const isDeposit = type === 'deposit';
  const isDirty = amount !== '';
  
  const storageKey = `fayas-bank-tx-${accountId}-${type}`;
  const { savedData, clearSavedData } = useFormAutoSave(storageKey, { amount }, isDirty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onSubmit(numericAmount);
      setAmount('');
      clearSavedData();
    }
  };
  
  const handleRestore = () => {
    if (savedData) {
        setAmount(savedData.amount);
        clearSavedData();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800/50 rounded-xl shadow-sm border border-white/10">
      <label htmlFor={`${type}-amount`} className="block text-sm font-semibold text-gray-300 mb-2">
        {isDeposit ? 'Make a Deposit' : 'Make a Withdrawal'}
      </label>
       {savedData && savedData.amount && (
         <div className="bg-amber-900/50 text-amber-200 text-xs px-3 py-1.5 rounded-lg flex items-center justify-between mb-2 animate-fade-in-up">
            <div className="flex items-center space-x-1.5">
                <RestoreIcon className="w-4 h-4 flex-shrink-0"/>
                <span className="leading-tight">Unsaved: ${savedData.amount}</span>
            </div>
            <div className="flex items-center space-x-2">
                <button type="button" onClick={handleRestore} className="font-bold hover:underline transition-all">Restore</button>
                <button type="button" onClick={clearSavedData} className="text-amber-300/70 hover:text-amber-200 transition-all text-lg leading-none" aria-label="Dismiss draft">&times;</button>
            </div>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <input
          id={`${type}-amount`}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          disabled={isLoading}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          step="0.01"
          min="0.01"
        />
        <button
          type="submit"
          disabled={isLoading || !amount}
          className={`px-4 py-2 flex items-center justify-center font-bold rounded-lg transition-all duration-300 transform active:scale-95 disabled:cursor-not-allowed shadow-sm ${
            isDeposit
              ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-red-800'
          } text-white`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            isDeposit ? <ArrowDownIcon className="w-5 h-5" /> : <ArrowUpIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
