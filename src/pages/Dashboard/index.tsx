import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Brain,
  FileText
} from 'lucide-react'

const Dashboard = () => {
  const { totalIncome, totalExpenses, balance, monthlyBudget } = useSelector(
    (state: RootState) => state.budget
  )
  const { insights, generatedContent } = useSelector((state: RootState) => state.ai)

  const budgetUtilization = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0

  const stats = [
    {
      name: 'Total Income',
      value: `$${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
    {
      name: 'Balance',
      value: `$${balance.toLocaleString()}`,
      icon: DollarSign,
      color: balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: balance >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900',
    },
    {
      name: 'Budget Used',
      value: `${budgetUtilization.toFixed(1)}%`,
      icon: Target,
      color: budgetUtilization > 80 ? 'text-red-600' : budgetUtilization > 60 ? 'text-yellow-600' : 'text-green-600',
      bgColor: budgetUtilization > 80 ? 'bg-red-100 dark:bg-red-900' : budgetUtilization > 60 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-green-100 dark:bg-green-900',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to your AI-powered budget management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Insights Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Insights
            </h2>
          </div>
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {insight.impact} impact
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No AI insights available. Add some budget data to get started.
            </p>
          )}
          <a
            href="/ai-insights"
            className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            View all insights
            <TrendingUp className="ml-1 h-4 w-4" />
          </a>
        </div>

        <div className="card p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Blog Posts
            </h2>
          </div>
          {generatedContent.length > 0 ? (
            <div className="space-y-3">
              {generatedContent.slice(0, 3).map((content) => (
                <div key={content.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {content.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      content.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      content.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {content.status}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No blog posts generated yet. Create your first AI-generated content.
            </p>
          )}
          <a
            href="/blog"
            className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            View all posts
            <FileText className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
