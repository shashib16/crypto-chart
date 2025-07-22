// components/Header.tsx
'use client'

import { Bell, User, Settings } from 'lucide-react'
import SearchBar from './SearchBar'
import { useAppSelector } from '../store/hooks'

export default function Header() {
  const { currentUser } = useAppSelector(state => state.user)
  
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          {/* User Profile */}
          <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <p className="text-xs text-gray-400">{currentUser?.plan}</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      </div>
      
     
    </header>
  )
}