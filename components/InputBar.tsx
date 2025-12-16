
import React, { useState } from 'react';
import SendIcon from './icons/SendIcon';

interface InputBarProps {
  onSubmit: (command: string) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSubmit, isLoading }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isLoading) {
      onSubmit(command);
      setCommand('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <span className="text-green-400 text-lg">$</span>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder={isLoading ? "Processing..." : "Enter command (e.g., 'help')..."}
        disabled={isLoading}
        className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-500 text-white rounded-md px-4 py-2 flex items-center justify-center font-bold hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          <SendIcon className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

export default InputBar;
