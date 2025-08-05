import React, { useState } from 'react';
import { X, Calendar, MapPin, DollarSign, Users, Image, Tag } from 'lucide-react';
import { Event } from '../types';
import { RECEIVER_WALLET_ADDRESS, EVENT_CATEGORIES, DEFAULT_ORGANIZER } from '../config/constants';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Omit<Event, 'id' | 'soldTickets'>) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreateEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    maxPrice: '',
    totalTickets: '',
    image: '',
    category: 'Technology',
    organizer: DEFAULT_ORGANIZER,
    receiverWallet: RECEIVER_WALLET_ADDRESS
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.maxPrice || parseFloat(formData.maxPrice) <= 0) newErrors.maxPrice = 'Valid max price is required';
    if (parseFloat(formData.maxPrice) < parseFloat(formData.price)) newErrors.maxPrice = 'Max price must be greater than or equal to price';
    if (!formData.totalTickets || parseInt(formData.totalTickets) <= 0) newErrors.totalTickets = 'Valid ticket count is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newEvent: Omit<Event, 'id' | 'soldTickets'> = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      price: parseFloat(formData.price),
      maxPrice: parseFloat(formData.maxPrice),
      totalTickets: parseInt(formData.totalTickets),
      image: formData.image,
      category: formData.category,
      organizer: formData.organizer,
      receiverWallet: RECEIVER_WALLET_ADDRESS
    };

    onCreateEvent(newEvent);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      price: '',
      maxPrice: '',
      totalTickets: '',
      image: '',
      category: 'Technology',
      organizer: DEFAULT_ORGANIZER,
      receiverWallet: RECEIVER_WALLET_ADDRESS
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
          <button
            onClick={onClose}
            className="glass-button p-2 rounded-lg text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.title ? 'border-red-300' : ''
                }`}
                placeholder="Enter event title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.description ? 'border-red-300' : ''
                }`}
                placeholder="Describe your event"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.date ? 'border-red-300' : ''
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.location ? 'border-red-300' : ''
                }`}
                placeholder="Event location"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Price (ETH)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.001"
                min="0"
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.price ? 'border-red-300' : ''
                }`}
                placeholder="0.03"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (ETH)
              </label>
              <input
                type="number"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleInputChange}
                step="0.001"
                min="0"
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.maxPrice ? 'border-red-300' : ''
                }`}
                placeholder="0.05"
              />
              {errors.maxPrice && <p className="text-red-500 text-sm mt-1">{errors.maxPrice}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Total Tickets
              </label>
              <input
                type="number"
                name="totalTickets"
                value={formData.totalTickets}
                onChange={handleInputChange}
                min="1"
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.totalTickets ? 'border-red-300' : ''
                }`}
                placeholder="100"
              />
              {errors.totalTickets && <p className="text-red-500 text-sm mt-1">{errors.totalTickets}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {EVENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-2" />
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className={`w-full glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  errors.image ? 'border-red-300' : ''
                }`}
                placeholder="https://images.unsplash.com/..."
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            <div className="md:col-span-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Payment Configuration</h4>
                <p className="text-sm text-blue-600 mb-2">
                  All ticket sales will be sent to the configured receiver wallet:
                </p>
                <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono text-blue-800">
                  {RECEIVER_WALLET_ADDRESS}
                </code>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="glass-button px-6 py-3 rounded-lg text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
