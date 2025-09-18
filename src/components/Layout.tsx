import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '@/store'
import { toggleSidebar, setTheme } from '@/store/slices/uiSlice'
import { 
  Home, 
  DollarSign, 
  BarChart3, 
  FileText, 
  Brain, 
  Settings, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch()
  const { theme, sidebarOpen } = useSelector((state: RootState) => state.ui)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Budget', href: '/budget', icon: DollarSign },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg`}>
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gradient">BudgetAI</h1>
          )}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  sidebarOpen ? 'justify-start' : 'justify-center'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={toggleTheme}
            className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {sidebarOpen && <span className="ml-3">Toggle Theme</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
