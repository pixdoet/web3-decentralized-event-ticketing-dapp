import React from 'react';
import { Wallet, Ticket, Sparkles } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              TicketChain
            </h1>
            <p className="text-sm text-gray-600">Decentralized Event Ticketing</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => setCurrentView('events')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              currentView === 'events'
                ? 'glass-button text-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setCurrentView('tickets')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              currentView === 'tickets'
                ? 'glass-button text-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            My Tickets
          </button>
          <button
            onClick={() => setCurrentView('ai-assistant')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
              currentView === 'ai-assistant'
                ? 'glass-button text-blue-600 font-medium'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          {wallet.isConnected ? (
            <div className="flex items-center space-x-3">
              <div className="glass-card px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Balance</p>
                <p className="font-semibold">{wallet.balance} ETH</p>
              </div>
              <div className="glass-card px-4 py-2 rounded-lg">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-mono text-sm">
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </p>
              </div>
              <button
                onClick={disconnectWallet}
                className="glass-button px-4 py-2 rounded-lg text-red-600 hover:text-red-700"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="glass-button px-6 py-3 rounded-lg flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
