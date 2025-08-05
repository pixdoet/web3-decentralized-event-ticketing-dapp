import React, { useState } from 'react';
import Header from './components/Header';
import EventsView from './components/EventsView';
import TicketsView from './components/TicketsView';
import AIAssistant from './components/AIAssistant';

function App() {
  const [currentView, setCurrentView] = useState('events');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'events':
        return <EventsView />;
      case 'tickets':
        return <TicketsView />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return <EventsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main>
          {renderCurrentView()}
        </main>
      </div>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}

export default App;
