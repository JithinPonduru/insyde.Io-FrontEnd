import React from 'react'
import { Box, FileType, Info } from 'lucide-react'

interface FooterProps {
  isDarkMode: boolean
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/50 backdrop-blur-lg border-t border-gray-800/50' 
        : 'bg-white/30 backdrop-blur-lg border-t border-white/50'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Box className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
              <h3 className={`text-sm font-semibold tracking-wider uppercase ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Features</h3>
            </div>
            <ul className="space-y-3">
              {['Model Import', '3D Visualization', 'Export Options', 'Interactive Controls'].map((item) => (
                <li key={item} className={`flex items-center gap-2 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-indigo-400' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileType className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
              <h3 className={`text-sm font-semibold tracking-wider uppercase ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Supported Formats</h3>
            </div>
            <ul className="space-y-3">
              {['.GLB / .GLTF', '.OBJ', '.STL'].map((format) => (
                <li key={format} className={`transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-indigo-400' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}>
                  {format}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
              <h3 className={`text-sm font-semibold tracking-wider uppercase ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>About</h3>
            </div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              A powerful 3D model viewer built with React Three Fiber and modern web technologies.
              Experience your 3D models with professional-grade tools and controls.
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800/50 pt-8">
          <p className={`text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} 3D Model Viewer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}