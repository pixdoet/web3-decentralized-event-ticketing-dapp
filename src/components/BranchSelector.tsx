import React from 'react'

interface Branch {
  name: string
  lastCommit: string
  commitCount: number
}

interface BranchSelectorProps {
  branches: Branch[]
  currentBranch: string
  onBranchChange: (branch: string) => void
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ 
  branches, 
  currentBranch, 
  onBranchChange 
}) => {
  return (
    <div className="glass animate-fade-in-up p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Branches
        </h2>
        <button className="glass-light px-3 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-white/30 transition-all duration-200">
          + New Branch
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div
            key={branch.name}
            onClick={() => onBranchChange(branch.name)}
            className={`glass-light p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/30 ${
              currentBranch === branch.name 
                ? 'ring-2 ring-blue-400 bg-white/25' 
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  branch.name === 'main' ? 'bg-green-400' : 'bg-blue-400'
                }`} />
                <span className="font-medium text-gray-800">{branch.name}</span>
                {currentBranch === branch.name && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Current
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 glass-light px-2 py-1 rounded">
                {branch.commitCount} commits
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">{branch.lastCommit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BranchSelector
