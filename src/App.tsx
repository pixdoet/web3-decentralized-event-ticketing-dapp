import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import BranchSelector from './components/BranchSelector'
import FileExplorer from './components/FileExplorer'
import CommitHistory from './components/CommitHistory'
import StatusPanel from './components/StatusPanel'

interface Branch {
  name: string
  lastCommit: string
  commitCount: number
}

interface FileItem {
  name: string
  type: 'file' | 'folder'
  modified: boolean
  size?: string
}

interface Commit {
  id: string
  message: string
  author: string
  date: string
  branch: string
}

function App() {
  const [currentBranch, setCurrentBranch] = useState<string>('main')
  const [branches] = useState<Branch[]>([
    { name: 'main', lastCommit: 'Initial commit', commitCount: 5 },
    { name: 'test1', lastCommit: 'Add test features', commitCount: 3 }
  ])

  const [files] = useState<FileItem[]>([
    { name: 'src', type: 'folder', modified: false },
    { name: 'public', type: 'folder', modified: false },
    { name: 'package.json', type: 'file', modified: true, size: '2.1 KB' },
    { name: 'README.md', type: 'file', modified: false, size: '1.5 KB' },
    { name: 'tsconfig.json', type: 'file', modified: false, size: '0.8 KB' },
    { name: 'vite.config.ts', type: 'file', modified: false, size: '0.3 KB' },
    { name: '.gitignore', type: 'file', modified: false, size: '0.2 KB' }
  ])

  const [commits] = useState<Commit[]>([
    {
      id: 'a1b2c3d',
      message: 'Add glassmorphism styling and components',
      author: 'Developer',
      date: '2024-01-15 14:30',
      branch: 'main'
    },
    {
      id: 'e4f5g6h',
      message: 'Initial project setup with Vite and React',
      author: 'Developer',
      date: '2024-01-15 10:15',
      branch: 'main'
    },
    {
      id: 'i7j8k9l',
      message: 'Add test configuration and utilities',
      author: 'Developer',
      date: '2024-01-14 16:45',
      branch: 'test1'
    },
    {
      id: 'm0n1o2p',
      message: 'Create test branch for experimental features',
      author: 'Developer',
      date: '2024-01-14 09:20',
      branch: 'test1'
    }
  ])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BranchSelector 
              branches={branches}
              currentBranch={currentBranch}
              onBranchChange={setCurrentBranch}
            />
            
            <FileExplorer files={files} currentBranch={currentBranch} />
          </div>
          
          <div className="space-y-6">
            <StatusPanel 
              currentBranch={currentBranch}
              modifiedFiles={files.filter(f => f.modified).length}
            />
            
            <CommitHistory 
              commits={commits.filter(c => c.branch === currentBranch)}
              currentBranch={currentBranch}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
