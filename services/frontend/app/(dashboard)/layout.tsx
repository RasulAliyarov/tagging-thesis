'use client'

import { useEffect, useState } from 'react'
import { Menu, Loader2 } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router])

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    )
  }

  // 2. If no token, return null (the useEffect will handle the redirect)
  // This prevents the "children" from rendering and throwing errors
  if (!token) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f172a]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-xl glass flex items-center justify-center border border-white/10"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}