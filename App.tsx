import React, { useState, useMemo } from 'react';
import { useBank } from './hooks/useBank';
import FayasBankIcon from './components/icons/FayasBankIcon';
import AccountList from './components/AccountList';
import AccountDetails from './components/AccountDetails';
import CreateAccountForm from './components/CreateAccountForm';
import ConfirmCloseDialog from './components/ConfirmCloseDialog';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { 
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
    clearError,
  } = useBank();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closingAccount, setClosingAccount] = useState<string | null>(null);

  const activeAccount = useMemo(() => {
    if (selectedAccount && accounts[selectedAccount]) {
      return { id: selectedAccount, ...accounts[selectedAccount] };
    }
    return null;
  }, [selectedAccount, accounts]);

  const handleCreateAccount = async (accData: { accNum: string, owner: string, initialDeposit: number }): Promise<boolean> => {
    const success = await createAccount(accData.accNum, accData.owner, accData.initialDeposit);
    if (success) {
      setIsModalOpen(false);
    }
    return success;
  };

  const handleConfirmClose = async () => {
    if (closingAccount) {
      await closeAccount(closingAccount);
      setClosingAccount(null);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 h-screen flex flex-col antialiased">
      <header className="bg-gray-950/70 backdrop-blur-sm border-b border-white/10 p-4 shadow-lg flex items-center space-x-3 flex-shrink-0 z-10">
        <FayasBankIcon className="w-8 h-8 text-amber-400" />
        <h1 className="text-xl font-bold text-white tracking-wide">FAYAS Bank</h1>
      </header>
      
      <main className="flex-1 p-4 sm:p-6 grid lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden">
        {/* Left Panel: Account List */}
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col h-full overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <AccountList 
            accounts={accounts}
            selectedAccount={selectedAccount}
            onSelectAccount={selectAccount}
            onCreateClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Right Panel: Account Details & Actions */}
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col h-full overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {activeAccount ? (
            <AccountDetails 
              account={activeAccount}
              onDeposit={deposit}
              onWithdraw={withdraw}
              onCloseAccountRequest={setClosingAccount}
              isLoading={isLoading}
              lastOperationCode={latestPythonCode}
              error={error}
              clearError={clearError}
            />
          ) : (
            <Dashboard accounts={accounts} onCreateClick={() => setIsModalOpen(true)} />
          )}
        </div>
      </main>

      {isModalOpen && (
        <CreateAccountForm 
          onSubmit={handleCreateAccount}
          onClose={() => setIsModalOpen(false)}
          isLoading={isLoading}
          error={error}
          clearError={clearError}
        />
      )}

      {closingAccount && (
        <ConfirmCloseDialog
          accountNumber={closingAccount}
          onConfirm={handleConfirmClose}
          onCancel={() => setClosingAccount(null)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default App;