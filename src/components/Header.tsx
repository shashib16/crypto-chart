'use client'

import { useTheme } from '@/contexts/ThemeContext'
import SearchBar from './SearchBar'
import { Bell, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [hasNotifications, setHasNotifications] = useState(true)
  const { theme, toggleTheme } = useTheme()
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between flex-shrink-0 transition-colors duration-200">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Shashi Kumar</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Premium</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">SK</span>
          </div>
        </div>
      </div>
    </header>
  )
}