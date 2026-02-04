'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutDashboard,
  History,
  Layers,
  FileText,
  Settings,
  BrainCircuit,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/app/context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/history', icon: History, label: 'History' },
    { href: '/batch', icon: Layers, label: 'Batch Process' },
    { href: '/single', icon: FileText, label: 'Single Analysis' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 glass border-r border-slate-700 flex flex-col
          fixed lg:relative h-full z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">TextAI</h1>
              <p className="text-xs text-slate-400 font-mono">Analysis v2.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  nav-item flex items-center space-x-3 px-4 py-3 rounded-xl
                  text-slate-300 hover:bg-slate-700/50 transition-all
                  ${isActive ? 'active' : ''}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <div>
                <p className="font-semibold text-sm">John Doe</p>
                <p className="text-xs text-slate-400">john@company.com</p>
              </div>
            </div>
            <button
              onClick={() => handleLogout()}
              className="w-full py-2 px-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-xs font-medium transition-colors flex items-center justify-center space-x-2">
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}