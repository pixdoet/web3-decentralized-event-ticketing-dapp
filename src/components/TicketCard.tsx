import React from 'react';
import { Calendar, MapPin, Coins, Tag, ExternalLink } from 'lucide-react';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onResell: (ticketId: string) => void;
  onTransfer: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onResell, onTransfer }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={ticket.event.image}
          alt={ticket.event.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className="glass px-2 py-1 rounded-full text-xs font-medium text-green-600">
            NFT #{ticket.tokenId}
          </span>
        </div>
        {ticket.isForSale && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              For Sale
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{ticket.event.title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">{new Date(ticket.event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">{ticket.event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Coins className="w-3 h-3" />
            <span className="text-xs">Purchased for {ticket.purchasePrice} ETH</span>
          </div>
        </div>

        {ticket.isForSale && (
          <div className="glass p-3 rounded-lg mb-4">
            <div className="flex items-center space-x-2 text-red-600">
              <Tag className="w-4 h-4" />
              <span className="font-medium">Sale Price: {ticket.salePrice} ETH</span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => onResell(ticket.id)}
            className="flex-1 glass-button px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {ticket.isForSale ? 'Update Price' : 'Resell'}
          </button>
          <button
            onClick={() => onTransfer(ticket.id)}
            className="flex-1 glass-button px-3 py-2 rounded-lg text-sm font-medium text-green-600 hover:text-green-700"
          >
            Transfer
          </button>
          <button className="glass-button px-3 py-2 rounded-lg text-gray-600 hover:text-gray-700">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
