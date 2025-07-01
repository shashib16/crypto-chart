'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Activity,
  Settings,
  BarChart3,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { id: 'markets', icon: TrendingUp, label: 'Markets', href: '/inprogress' },
    { id: 'portfolio', icon: Wallet, label: 'Portfolio', href: '/inprogress' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', href: '/inprogress' },
    { id: 'activity', icon: Activity, label: 'Activity', href: '/inprogress' },
    { id: 'community', icon: Users, label: 'Community', href: '/inprogress' },
    { id: 'alerts', icon: Bell, label: 'Alerts', href: '/inprogress' },
    { id: 'settings', icon: Settings, label: 'Settings', href: '/inprogress' },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className={`h-16 border-b border-gray-700 flex items-center ${
          collapsed ? 'justify-center px-2' : 'justify-between px-6'
        }`}>
          {/* Logo */}
          <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <h1 className="text-xl font-bold text-white">CryptoDash</h1>
            )}
          </div>
          
          {/* Toggle Button - Only show in expanded state */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center rounded-lg transition-all group relative ${
                    collapsed 
                      ? 'justify-center p-3 hover:bg-gray-700' 
                      : 'gap-3 px-4 py-3 hover:bg-gray-700'
                  } ${
                    activeItem === item.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-gray-700">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className={`border-t border-gray-700 ${collapsed ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center rounded-lg hover:bg-gray-700 transition-colors cursor-pointer ${
            collapsed ? 'justify-center p-2' : 'gap-3 p-3'
          }`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white">SK</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Shashi Kumar</p>
                <p className="text-xs text-gray-400 truncate">shashi@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Floating Expand Button - Only show when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed left-20 top-6 -ml-3 p-1.5 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition-all z-50 shadow-lg"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed bottom-4 left-4 p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors md:hidden z-50"
      >
        {collapsed ? <Menu className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
      </button>
    </>
  )
}