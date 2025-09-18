import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { useAI } from '@/hooks/useAI'
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react'
import toast from 'react-hot-toast'

const AIInsights = () => {
  const dispatch = useDispatch()
  const { insights, isAnalyzing } = useSelector((state: RootState) => state.ai)
  const { generateInsights } = useAI()

  const handleGenerateInsights = async () => {
    try {
      await generateInsights()
      toast.success('AI insights generated successfully!')
    } catch (error) {
      toast.error('Failed to generate insights')
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending_pattern':
        return <TrendingUp className="h-5 w-5" />
      case 'budget_alert':
        return <AlertTriangle className="h-5 w-5" />
      case 'saving_opportunity':
        return <Lightbulb className="h-5 w-5" />
      case 'trend_analysis':
        return <Target className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'spending_pattern':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
      case 'budget_alert':
        return 'text-red-600 bg-red-100 dark:bg-red-900'
      case 'saving_opportunity':
        return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'trend_analysis':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get personalized financial insights powered by artificial intelligence
          </p>
        </div>
        <button
          onClick={handleGenerateInsights}
          className="btn btn-primary flex items-center"
          disabled={isAnalyzing}
        >
          <Brain className="h-5 w-5 mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {isAnalyzing && (
        <div className="card p-6">
          <div className="flex items-center justify-center">
            <div className="spinner mr-3" />
            <span className="text-gray-600 dark:text-gray-400">
              AI is analyzing your financial data...
            </span>
          </div>
        </div>
      )}

      {insights.length === 0 && !isAnalyzing ? (
        <div className="card p-12 text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No insights available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add some budget data and generate AI insights to get personalized recommendations
          </p>
          <button
            onClick={handleGenerateInsights}
            className="btn btn-primary"
          >
            Generate First Insights
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight.id} className="card p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getInsightColor(insight.type)}`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {insight.impact} impact
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {insight.description}
                  </p>
                  
                  {insight.actionable && insight.actionText && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Recommended Action:
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200">
                        {insight.actionText}
                      </p>
                      {insight.actionUrl && (
                        <a
                          href={insight.actionUrl}
                          className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Learn More
                          <TrendingUp className="ml-1 h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Generated on {new Date(insight.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIInsights
