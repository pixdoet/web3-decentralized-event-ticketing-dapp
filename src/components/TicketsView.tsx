import React, { useState } from 'react';
import { Ticket as TicketIcon, TrendingUp, Wallet } from 'lucide-react';
import TicketCard from './TicketCard';
import { mockTickets } from '../data/mockData';
import { Ticket } from '../types';

const TicketsView: React.FC = () => {
  const [tickets] = useState<Ticket[]>(mockTickets);

  const totalValue = tickets.reduce((sum, ticket) => sum + ticket.purchasePrice, 0);
  const forSaleCount = tickets.filter(ticket => ticket.isForSale).length;

  const handleResell = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      const maxPrice = ticket.event.maxPrice;
      const currentPrice = ticket.salePrice || ticket.purchasePrice * 1.2;
      
      const newPrice = prompt(
        `Set resale price for ${ticket.event.title}\n\nOriginal price: ${ticket.purchasePrice} ETH\nMax allowed: ${maxPrice} ETH\nCurrent price: ${currentPrice} ETH`,
        currentPrice.toString()
      );
      
      if (newPrice && parseFloat(newPrice) <= maxPrice) {
        alert(`Ticket listed for ${newPrice} ETH!\n\nThis would normally:\n1. Update smart contract\n2. Set new sale price\n3. Enable marketplace visibility`);
      } else if (newPrice) {
        alert(`Price too high! Maximum allowed is ${maxPrice} ETH (1.5x original price)`);
      }
    }
  };

  const handleTransfer = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      const address = prompt(
        `Transfer ${ticket.event.title} ticket to:\n\nEnter recipient wallet address:`
      );
      
      if (address && address.startsWith('0x') && address.length === 42) {
        alert(`Transferring ticket to ${address}!\n\nThis would normally:\n1. Call smart contract transfer function\n2. Update NFT ownership\n3. Remove ticket from your wallet`);
      } else if (address) {
        alert('Invalid wallet address. Please enter a valid Ethereum address.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <TicketIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My NFT Tickets</h2>
            <p className="text-gray-600">Manage your event tickets and resale listings</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Total Tickets</p>
                <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Portfolio Value</p>
                <p className="text-2xl font-bold text-green-600">{totalValue.toFixed(2)} ETH</p>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <TicketIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">For Sale</p>
                <p className="text-2xl font-bold text-purple-600">{forSaleCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onResell={handleResell}
              onTransfer={handleTransfer}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-gray-400 mb-4">
            <TicketIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tickets yet</h3>
          <p className="text-gray-500 mb-6">Start by minting your first NFT ticket from our events</p>
          <button className="glass-button px-6 py-3 rounded-lg text-blue-600 hover:text-blue-700 font-medium">
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketsView;
