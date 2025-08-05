import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Scan, TrendingUp } from 'lucide-react';
import { mockEvents } from '../data/mockData';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your Non-Fungible Agent. I can analyze your ticket ownership history and recommend events based on your preferences. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('recommend') || input.includes('suggest')) {
      return 'Based on your ticket history, I recommend the Blockchain Summit 2024. You\'ve shown interest in technology events, and this summit features cutting-edge discussions on DeFi and Web3. The event has a 68% attendance rate and tickets are priced at 0.5 ETH.';
    }
    
    if (input.includes('history') || input.includes('tickets')) {
      return 'I can see you own 2 NFT tickets: Blockchain Summit 2024 (Token #1001) and DeFi Music Festival (Token #1002, currently listed for resale). Your portfolio shows a preference for technology and music events.';
    }
    
    if (input.includes('price') || input.includes('value')) {
      return 'Your current ticket portfolio is valued at approximately 0.8 ETH. The DeFi Music Festival ticket has appreciated 33% since purchase and could sell for up to 0.45 ETH based on current market trends.';
    }
    
    return 'I understand you\'re interested in event recommendations. I analyze your ticket ownership patterns, event attendance history, and market trends to suggest events you might enjoy. Would you like me to scan your wallet for a personalized recommendation?';
  };

  const handleWalletScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const scanMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '🔍 Wallet scan complete! I found 2 NFT tickets in your wallet. Based on your ownership of technology and music event tickets, I recommend:\n\n1. Web3 Gaming Convention (0.4 ETH) - 85% match\n2. NFT Art Gallery Opening (0.2 ETH) - 72% match\n\nBoth events align with your interests in emerging technologies and creative applications of blockchain.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, scanMessage]);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Ticket Assistant
            </h2>
            <p className="text-gray-600">Your Non-Fungible Agent for personalized event recommendations</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleWalletScan}
            disabled={isScanning}
            className="glass-button p-4 rounded-xl flex items-center space-x-3 hover:scale-105 transition-all duration-300"
          >
            <Scan className={`w-5 h-5 text-blue-600 ${isScanning ? 'animate-spin' : ''}`} />
            <div className="text-left">
              <p className="font-medium text-gray-800">Scan Wallet</p>
              <p className="text-sm text-gray-600">Analyze your NFT tickets</p>
            </div>
          </button>

          <div className="glass p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Portfolio Value</p>
                <p className="text-sm text-gray-600">0.8 ETH (+12.5%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className={`glass-card p-4 rounded-xl ${
                  message.type === 'user' ? 'bg-blue-50/50' : 'bg-purple-50/50'
                }`}>
                  <p className="text-gray-800 whitespace-pre-line">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/20">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about event recommendations, ticket analysis, or market trends..."
              className="flex-1 glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              onClick={handleSendMessage}
              className="glass-button px-6 py-3 rounded-lg text-blue-600 hover:text-blue-700 transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
