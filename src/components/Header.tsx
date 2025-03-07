import React from 'react'
import { Boxes, Github, Sun, Moon } from 'lucide-react'

interface HeaderProps {
  isDarkMode: boolean
  toggleTheme: () => void
  currentPage: 'viewer' | 'gallery'
  setCurrentPage: (page: 'viewer' | 'gallery') => void
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, currentPage, setCurrentPage }) => {
  return (
    <header className={`transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/50 backdrop-blur-lg border-b border-gray-800/50' 
        : 'bg-white/30 backdrop-blur-lg border-b border-white/50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Boxes className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              3D Model Viewer
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('viewer')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  currentPage === 'viewer'
                    ? isDarkMode 
                      ? 'bg-indigo-600/20 text-indigo-300'
                      : 'bg-indigo-100 text-indigo-600'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-indigo-300'
                      : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Viewer
              </button>
              <button
                onClick={() => setCurrentPage('gallery')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  currentPage === 'gallery'
                    ? isDarkMode 
                      ? 'bg-indigo-600/20 text-indigo-300'
                      : 'bg-indigo-100 text-indigo-600'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-indigo-300'
                      : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Gallery
              </button>
            </nav>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-orange-500 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-indigo-400' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}