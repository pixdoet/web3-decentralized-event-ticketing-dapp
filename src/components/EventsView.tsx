import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import EventCard from './EventCard';
import { mockEvents } from '../data/mockData';
import { Event } from '../types';

const EventsView: React.FC = () => {
  const [events] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Technology', 'Music', 'Art', 'Gaming'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMintTicket = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      alert(`Minting NFT ticket for ${event.title}!\n\nThis would normally:\n1. Call smart contract mint function\n2. Transfer ${event.price} ETH\n3. Generate unique NFT with event metadata\n4. Add ticket to your wallet`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Discover Events</h2>
            <p className="text-gray-600">Find and mint NFT tickets for amazing events</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`glass-button p-2 rounded-lg ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`glass-button p-2 rounded-lg ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onMintTicket={handleMintTicket}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default EventsView;
