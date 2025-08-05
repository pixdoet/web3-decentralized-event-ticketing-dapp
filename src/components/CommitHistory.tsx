import React from 'react'

interface Commit {
  id: string
  message: string
  author: string
  date: string
  branch: string
}

interface CommitHistoryProps {
  commits: Commit[]
  currentBranch: string
}

const CommitHistory: React.FC<CommitHistoryProps> = ({ commits, currentBranch }) => {
  return (
    <div className="glass animate-fade-in-up p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Recent Commits
        </h2>
        <span className="text-xs text-gray-500 glass-light px-2 py-1 rounded">
          {currentBranch}
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {commits.map((commit, index) => (
          <div key={commit.id} className="glass-light p-4 rounded-lg hover:bg-white/30 transition-all duration-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {commit.author.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {commit.message}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-600">
                    {commit.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {commit.date}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">
                    {commit.id}
                  </code>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 glass-light py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/30 transition-all duration-200">
        View All Commits
      </button>
    </div>
  )
}

export default CommitHistory
