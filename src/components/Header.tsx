import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="glass animate-fade-in-up p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 glass-light rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Glassmorphism Repository</h1>
            <p className="text-gray-600 text-sm">Modern Git Interface with Beautiful Design</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="glass-light px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/30 transition-all duration-200">
            Clone
          </button>
          <button className="glass-light px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/30 transition-all duration-200">
            Pull
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
            Push
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
