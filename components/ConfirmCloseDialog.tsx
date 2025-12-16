import React from 'react';
import TrashIcon from './icons/TrashIcon';

interface ConfirmCloseDialogProps {
  accountNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ConfirmCloseDialog: React.FC<ConfirmCloseDialogProps> = ({ accountNumber, onConfirm, onCancel, isLoading }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 sm:p-6 border-b border-white/10">
          <h2 className="text-lg font-bold text-red-400">Confirm Account Closure</h2>
        </header>

        <main className="p-6">
          <p className="text-gray-300">
            Are you sure you want to permanently close account{' '}
            <strong className="font-semibold text-white">#{accountNumber}</strong>?
          </p>
          <p className="mt-2 text-sm text-gray-400">This action cannot be undone and all transaction data will be lost.</p>
        </main>
        
        <footer className="p-4 bg-gray-900/50 border-t border-white/10 flex justify-end items-center space-x-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 flex items-center space-x-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors shadow-sm active:scale-95"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <TrashIcon className="w-5 h-5" />
            )}
            <span>Confirm & Close</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmCloseDialog;