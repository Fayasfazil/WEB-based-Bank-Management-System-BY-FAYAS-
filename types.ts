export enum ConsoleLineType {
  COMMAND = 'COMMAND',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
  SYSTEM = 'SYSTEM',
  PYTHON = 'PYTHON',
}

export interface ConsoleLine {
  id: number;
  type: ConsoleLineType;
  text: string;
}

export type TransactionType = 'deposit' | 'withdraw';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
}

export interface Account {
  owner: string;
  balance: number;
  history: Transaction[];
  createdAt: string;
}

export interface Accounts {
  [accountNumber: string]: Account;
}