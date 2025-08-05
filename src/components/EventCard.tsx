import React from 'react';
import { Calendar, MapPin, Users, Coins } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onMintTicket: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onMintTicket }) => {
  const soldPercentage = (event.soldTickets / event.totalTickets) * 100;

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 animate-float">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="glass px-3 py-1 rounded-full text-sm font-medium text-blue-600">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{event.soldTickets}/{event.totalTickets} tickets sold</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Availability</span>
            <span>{soldPercentage.toFixed(0)}% sold</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${soldPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-bold text-lg">{event.price} ETH</p>
              <p className="text-xs text-gray-500">Max resale: {event.maxPrice} ETH</p>
            </div>
          </div>
          
          <button
            onClick={() => onMintTicket(event.id)}
            className="glass-button px-6 py-3 rounded-lg font-medium text-blue-600 hover:text-blue-700 transition-all duration-300 hover:animate-glow"
            disabled={event.soldTickets >= event.totalTickets}
          >
            {event.soldTickets >= event.totalTickets ? 'Sold Out' : 'Mint Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
