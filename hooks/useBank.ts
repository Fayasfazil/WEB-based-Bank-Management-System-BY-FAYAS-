import { useState, useCallback } from 'react';
import type { Accounts, Transaction, TransactionType } from '../types';
import { generatePythonCodeForCommand } from '../services/geminiService';

export const useBank = () => {
  const [accounts, setAccounts] = useState<Accounts>({});
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latestPythonCode, setLatestPythonCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const selectAccount = useCallback((accountNumber: string) => {
    clearError();
    setSelectedAccount(accountNumber);
    setLatestPythonCode(''); // Clear code when switching accounts
  }, [clearError]);

  const createAccount = async (accNum: string, owner: string, initialDeposit: number): Promise<boolean> => {
    clearError();
    if (!accNum || !owner || initialDeposit === null) {
        setError("Account creation failed: Please fill out all fields (Account Number, Owner Name, Initial Deposit).");
        return false;
    }
    if (isNaN(initialDeposit) || initialDeposit < 0) {
      setError("Invalid amount: The initial deposit must be zero or a positive number.");
      return false;
    }
    if (accounts[accNum]) {
      setError(`Account creation failed: Account number '${accNum}' is already taken. Please choose a unique number.`);
      return false;
    }

    setIsLoading(true);
    try {
      const command = `create_account ${accNum} ${owner} ${initialDeposit}`;
      const pythonCode = await generatePythonCodeForCommand(command);
      setLatestPythonCode(pythonCode);

      const initialTransaction: Transaction[] = [];
      if (initialDeposit > 0) {
        initialTransaction.push({
          id: crypto.randomUUID(),
          type: 'deposit',
          amount: initialDeposit,
          timestamp: new Date().toISOString(),
        });
      }

      setAccounts(prev => ({
        ...prev,
        [accNum]: { 
          owner, 
          balance: initialDeposit, 
          history: initialTransaction,
          createdAt: new Date().toISOString(),
        }
      }));
      setSelectedAccount(accNum);
      return true;
    } catch (e) {
      setError(`An unexpected error occurred during account creation. Please try again. Details: ${e instanceof Error ? e.message : 'Unknown'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = (accNum: string, type: TransactionType, amount: number) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      timestamp: new Date().toISOString(),
    };
    setAccounts(prev => {
        const account = prev[accNum];
        if (!account) return prev;
        return {
            ...prev,
            [accNum]: {
                ...account,
                balance: type === 'deposit' ? account.balance + amount : account.balance - amount,
                history: [newTransaction, ...account.history],
            }
        };
    });
  };

  const deposit = async (accNum: string, amount: number) => {
    clearError();
    if (isNaN(amount) || amount <= 0) {
      setError("Invalid amount: Deposit amount must be a positive number.");
      return;
    }
    if (!accounts[accNum]) {
      setError(`Transaction failed: Account '${accNum}' could not be found.`);
      return;
    }

    setIsLoading(true);
    try {
      const command = `deposit ${accNum} ${amount}`;
      const pythonCode = await generatePythonCodeForCommand(command);
      setLatestPythonCode(pythonCode);
      
      addTransaction(accNum, 'deposit', amount);

    } catch (e) {
      setError(`An unexpected error occurred during deposit. Please try again. Details: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (accNum: string, amount: number) => {
    clearError();
    if (isNaN(amount) || amount <= 0) {
      setError("Invalid amount: Withdrawal amount must be a positive number.");
      return;
    }
    const account = accounts[accNum];
    if (!account) {
      setError(`Transaction failed: Account '${accNum}' could not be found.`);
      return;
    }
    if (account.balance < amount) {
      setError(`Withdrawal failed: Insufficient funds. Your current balance is $${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
      return;
    }
    
    setIsLoading(true);
    try {
      const command = `withdraw ${accNum} ${amount}`;
      const pythonCode = await generatePythonCodeForCommand(command);
      setLatestPythonCode(pythonCode);

      addTransaction(accNum, 'withdraw', amount);
      
    } catch (e) {
      setError(`An unexpected error occurred during withdrawal. Please try again. Details: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAccount = async (accNum: string) => {
    clearError();
    if (!accounts[accNum]) {
        setError(`Account closure failed: Account '${accNum}' could not be found.`);
        return;
    }

    setIsLoading(true);
    try {
        const command = `close_account ${accNum}`;
        const pythonCode = await generatePythonCodeForCommand(command);
        setLatestPythonCode(pythonCode);

        setAccounts(prev => {
            const newAccounts = { ...prev };
            delete newAccounts[accNum];
            return newAccounts;
        });

        if (selectedAccount === accNum) {
            setSelectedAccount(null);
            setLatestPythonCode(''); // Clear code as no account is selected
        }
    } catch (e) {
        setError(`An unexpected error occurred while closing the account. Please try again. Details: ${e instanceof Error ? e.message : 'Unknown'}`);
    } finally {
        setIsLoading(false);
    }
  };


  return { 
    accounts, 
    selectedAccount, 
    isLoading, 
    latestPythonCode,
    error,
    createAccount, 
    selectAccount,
    deposit,
    withdraw,
    closeAccount,
    clearError
  };
};