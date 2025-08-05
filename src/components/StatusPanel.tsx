import React from 'react'

interface StatusPanelProps {
  currentBranch: string
  modifiedFiles: number
}

const StatusPanel: React.FC<StatusPanelProps> = ({ currentBranch, modifiedFiles }) => {
  return (
    <div className="glass animate-fade-in-up p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        Repository Status
      </h2>
      
      <div className="space-y-4">
        <div className="glass-light p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Branch</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <span className="text-sm font-semibold text-gray-800">{currentBranch}</span>
            </div>
          </div>
        </div>
        
        <div className="glass-light p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Modified Files</span>
            <span className={`text-sm font-semibold ${modifiedFiles > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {modifiedFiles}
            </span>
          </div>
          {modifiedFiles > 0 && (
            <div className="mt-2">
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200">
                Commit Changes
              </button>
            </div>
          )}
        </div>
        
        <div className="glass-light p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Repository Status</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm text-green-600 font-medium">Up to date</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <button className="w-full glass-light py-2 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/30 transition-all duration-200">
            Fetch Origin
          </button>
          <button className="w-full glass-light py-2 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/30 transition-all duration-200">
            Merge Branch
          </button>
          <button className="w-full glass-light py-2 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/30 transition-all duration-200">
            Create Pull Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatusPanel
