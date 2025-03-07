import React, { useState } from 'react'
import { ModelViewer } from './components/ModelViewer'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentPage, setCurrentPage] = useState<'viewer' | 'gallery'>('viewer')

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-blue-50 to-indigo-100'
    }`}>      
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <main className={`flex-grow container mx-auto px-4 py-8 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className={`backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-900/50 border border-gray-800/50' 
              : 'bg-white/30 border border-white/50'
          }`}>
            <div className="p-8">
              {currentPage === 'viewer' ? (
                <>
                  <div className="flex flex-col items-center justify-center text-center mb-8">
                    <h1 className={`text-4xl font-bold mb-4 ${
                      isDarkMode
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400'
                        : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'
                    }`}>
                      Interactive 3D Model Viewer
                    </h1>
                    <p className={`text-lg max-w-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Experience your 3D models in real-time with our advanced viewer. 
                      Upload, interact, and explore your designs with professional-grade tools.
                    </p>
                  </div>
                  <ModelViewer className="w-full" isDarkMode={isDarkMode} />
                </>
              ) : (
                <Gallery isDarkMode={isDarkMode} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}

export default App