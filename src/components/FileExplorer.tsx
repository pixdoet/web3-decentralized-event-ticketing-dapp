import React from 'react'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  modified: boolean
  size?: string
}

interface FileExplorerProps {
  files: FileItem[]
  currentBranch: string
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, currentBranch }) => {
  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      )
    }
    
    const extension = file.name.split('.').pop()
    switch (extension) {
      case 'json':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
      case 'md':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
      case 'ts':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className="glass animate-fade-in-up p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          Files ({currentBranch})
        </h2>
        <div className="flex space-x-2">
          <button className="glass-light px-3 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-white/30 transition-all duration-200">
            + Add File
          </button>
          <button className="glass-light px-3 py-1 rounded-lg text-xs font-medium text-gray-600 hover:bg-white/30 transition-all duration-200">
            Upload
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="glass-light p-3 rounded-lg hover:bg-white/30 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <span className={`font-medium ${file.modified ? 'text-orange-700' : 'text-gray-800'}`}>
                  {file.name}
                </span>
                {file.modified && (
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                )}
              </div>
              <div className="flex items-center space-x-3">
                {file.size && (
                  <span className="text-xs text-gray-500">{file.size}</span>
                )}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                  <button className="p-1 hover:bg-white/20 rounded">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-white/20 rounded">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a3 3 0 003 3h2a3 3 0 003-3V3a2 2 0 012 2v6.5l1.5 1.5a1 1 0 01-1.414 1.414L15 14.414V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.586l-1.586 1.586A1 1 0 012 14.414L3.5 12.914V5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileExplorer
