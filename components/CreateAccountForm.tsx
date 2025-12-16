import React, { useState, useEffect } from 'react';
import PlusIcon from './icons/PlusIcon';
import RestoreIcon from './icons/RestoreIcon';
import { useFormAutoSave } from '../hooks/useFormAutoSave';

interface CreateAccountFormProps {
  onSubmit: (data: { accNum: string, owner: string, initialDeposit: number }) => Promise<boolean>;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ onSubmit, onClose, isLoading, error, clearError }) => {
  const [accNum, setAccNum] = useState('');
  const [owner, setOwner] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');

  const isDirty = accNum !== '' || owner !== '' || initialDeposit !== '';
  const formData = { accNum, owner, initialDeposit };
  const { savedData, clearSavedData } = useFormAutoSave('fayas-bank-create-account', formData, isDirty);

  useEffect(() => {
    // Clear any previous errors when the form is opened
    clearError();
  }, [clearError]);

  const handleRestore = () => {
    if (savedData) {
      setAccNum(savedData.accNum);
      setOwner(savedData.owner);
      setInitialDeposit(savedData.initialDeposit);
      clearSavedData(); // Hide notification after restoring
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await onSubmit({
      accNum,
      owner,
      initialDeposit: parseFloat(initialDeposit) || 0,
    });
    if (success) {
      clearSavedData();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <header className="p-4 sm:p-6 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Create New Bank Account</h2>
          </header>

          <main className="p-4 sm:p-6 space-y-4">
             {error && (
                <div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm relative" role="alert">
                    <span className="pr-8">{error}</span>
                    <button type="button" onClick={clearError} className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full text-red-300/70 hover:bg-red-800/50 hover:text-red-200 transition-colors" aria-label="Dismiss error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
             {savedData && (
                <div className="bg-amber-900/50 text-amber-200 text-sm px-4 py-2.5 rounded-lg flex items-center justify-between animate-fade-in-up">
                    <div className="flex items-center space-x-2">
                        <RestoreIcon className="w-5 h-5 flex-shrink-0"/>
                        <span className="leading-tight">You have an unsaved draft.</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button type="button" onClick={handleRestore} className="font-bold hover:underline transition-all">Restore</button>
                        <button type="button" onClick={clearSavedData} className="text-amber-300/70 hover:text-amber-200 transition-all text-xl leading-none" aria-label="Dismiss draft">&times;</button>
                    </div>
                </div>
            )}
            <div>
              <label htmlFor="accNum" className="block text-sm font-medium text-gray-300 mb-1">Account Number</label>
              <input
                id="accNum"
                type="text"
                value={accNum}
                onChange={(e) => setAccNum(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-300 mb-1">Owner Name</label>
              <input
                id="owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-300 mb-1">Initial Deposit ($)</label>
              <input
                id="initialDeposit"
                type="number"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                step="0.01"
                min="0"
                required
              />
            </div>
          </main>
          
          <footer className="p-4 bg-gray-900/50 border-t border-white/10 flex justify-end items-center space-x-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 border border-transparent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 flex items-center space-x-2 rounded-lg text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:cursor-not-allowed transition-colors shadow-sm active:scale-95"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
              <span>Create Account</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountForm;