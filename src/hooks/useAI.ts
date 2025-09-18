import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { 
  addInsight, 
  addGeneratedContent, 
  setAnalyzing, 
  setError,
  setLastAnalysis 
} from '@/store/slices/aiSlice'
import { aiService } from '@/services/aiService'
import { BudgetItem, BudgetCategory } from '@/store/slices/budgetSlice'

export const useAI = () => {
  const dispatch = useDispatch()
  const { 
    aiEnabled, 
    apiKey, 
    model, 
    isAnalyzing, 
    insights, 
    generatedContent,
    error 
  } = useSelector((state: RootState) => state.ai)
  
  const { items: budgetItems, categories, totalIncome, totalExpenses } = useSelector(
    (state: RootState) => state.budget
  )

  const generateInsights = useCallback(async () => {
    if (!aiEnabled || !apiKey) {
      dispatch(setError('AI not enabled or API key missing'))
      return
    }

    try {
      dispatch(setAnalyzing(true))
      dispatch(setError(null))

      if (!aiService.isInitialized()) {
        aiService.initialize(apiKey)
      }

      const newInsights = await aiService.generateInsights(
        budgetItems,
        categories,
        totalIncome,
        totalExpenses
      )

      newInsights.forEach(insight => {
        dispatch(addInsight(insight))
      })

      dispatch(setLastAnalysis(Date.now()))
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to generate insights'))
    } finally {
      dispatch(setAnalyzing(false))
    }
  }, [aiEnabled, apiKey, budgetItems, categories, totalIncome, totalExpenses, dispatch])

  const generateBlogPost = useCallback(async (
    topic: string,
    style: 'professional' | 'casual' | 'technical' = 'professional'
  ) => {
    if (!aiEnabled || !apiKey) {
      dispatch(setError('AI not enabled or API key missing'))
      return
    }

    try {
      dispatch(setAnalyzing(true))
      dispatch(setError(null))

      if (!aiService.isInitialized()) {
        aiService.initialize(apiKey)
      }

      const content = await aiService.generateBlogPost(
        topic,
        { items: budgetItems, categories },
        style
      )

      dispatch(addGeneratedContent(content))
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to generate blog post'))
    } finally {
      dispatch(setAnalyzing(false))
    }
  }, [aiEnabled, apiKey, budgetItems, categories, dispatch])

  const generateSummary = useCallback(async (period: 'week' | 'month' | 'year' = 'month') => {
    if (!aiEnabled || !apiKey) {
      dispatch(setError('AI not enabled or API key missing'))
      return ''
    }

    try {
      dispatch(setAnalyzing(true))
      dispatch(setError(null))

      if (!aiService.isInitialized()) {
        aiService.initialize(apiKey)
      }

      const summary = await aiService.generateSummary(budgetItems, period)
      return summary
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to generate summary'))
      return ''
    } finally {
      dispatch(setAnalyzing(false))
    }
  }, [aiEnabled, apiKey, budgetItems, dispatch])

  return {
    // State
    aiEnabled,
    apiKey,
    model,
    isAnalyzing,
    insights,
    generatedContent,
    error,
    
    // Actions
    generateInsights,
    generateBlogPost,
    generateSummary,
  }
}
