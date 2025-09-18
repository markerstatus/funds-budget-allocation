import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Budget from './pages/Budget'
import Analytics from './pages/Analytics'
import Blog from './pages/Blog'
import BlogPost from './pages/Blog/BlogPost'
import Settings from './pages/Settings'
import AIInsights from './pages/AIInsights'

function App() {
  const { theme } = useSelector((state: RootState) => state.ui)

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
// https://www.figma.com/make/J0YNzXx0uEQRp8xLmp8xyk/Dynamic-Fund-Application-Table?fullscreen=1