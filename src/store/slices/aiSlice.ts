import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AIInsight {
  id: string
  type: 'spending_pattern' | 'budget_alert' | 'saving_opportunity' | 'trend_analysis'
  title: string
  description: string
  confidence: number
  actionable: boolean
  actionText?: string
  actionUrl?: string
  timestamp: number
  category?: string
  impact: 'low' | 'medium' | 'high'
}

export interface AIGeneratedContent {
  id: string
  type: 'blog_post' | 'summary' | 'analysis' | 'recommendation'
  title: string
  content: string
  tags: string[]
  createdAt: number
  status: 'draft' | 'published' | 'archived'
}

interface AIState {
  insights: AIInsight[]
  generatedContent: AIGeneratedContent[]
  isAnalyzing: boolean
  lastAnalysis: number | null
  aiEnabled: boolean
  apiKey: string | null
  model: string
  settings: {
    autoAnalysis: boolean
    insightFrequency: 'daily' | 'weekly' | 'monthly'
    contentGeneration: boolean
    personalizedRecommendations: boolean
  }
  error: string | null
}

const initialState: AIState = {
  insights: [],
  generatedContent: [],
  isAnalyzing: false,
  lastAnalysis: null,
  aiEnabled: false,
  apiKey: null,
  model: 'gpt-3.5-turbo',
  settings: {
    autoAnalysis: true,
    insightFrequency: 'weekly',
    contentGeneration: true,
    personalizedRecommendations: true,
  },
  error: null,
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setAIEnabled: (state, action: PayloadAction<boolean>) => {
      state.aiEnabled = action.payload
    },
    
    setAPIKey: (state, action: PayloadAction<string | null>) => {
      state.apiKey = action.payload
    },
    
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload
    },
    
    addInsight: (state, action: PayloadAction<Omit<AIInsight, 'id' | 'timestamp'>>) => {
      const insight: AIInsight = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      state.insights.unshift(insight)
    },
    
    removeInsight: (state, action: PayloadAction<string>) => {
      state.insights = state.insights.filter(insight => insight.id !== action.payload)
    },
    
    clearInsights: (state) => {
      state.insights = []
    },
    
    addGeneratedContent: (state, action: PayloadAction<Omit<AIGeneratedContent, 'id' | 'createdAt'>>) => {
      const content: AIGeneratedContent = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: Date.now(),
      }
      state.generatedContent.unshift(content)
    },
    
    updateGeneratedContent: (state, action: PayloadAction<AIGeneratedContent>) => {
      const index = state.generatedContent.findIndex(content => content.id === action.payload.id)
      if (index !== -1) {
        state.generatedContent[index] = action.payload
      }
    },
    
    deleteGeneratedContent: (state, action: PayloadAction<string>) => {
      state.generatedContent = state.generatedContent.filter(content => content.id !== action.payload)
    },
    
    setAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload
    },
    
    setLastAnalysis: (state, action: PayloadAction<number>) => {
      state.lastAnalysis = action.payload
    },
    
    updateSettings: (state, action: PayloadAction<Partial<AIState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    resetAI: () => initialState,
  },
})

export const {
  setAIEnabled,
  setAPIKey,
  setModel,
  addInsight,
  removeInsight,
  clearInsights,
  addGeneratedContent,
  updateGeneratedContent,
  deleteGeneratedContent,
  setAnalyzing,
  setLastAnalysis,
  updateSettings,
  setError,
  resetAI,
} = aiSlice.actions

export default aiSlice.reducer
