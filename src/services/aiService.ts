import OpenAI from 'openai'
import { AIInsight, AIGeneratedContent } from '@/store/slices/aiSlice'
import { BudgetItem, BudgetCategory } from '@/store/slices/budgetSlice'

class AIService {
  private openai: OpenAI | null = null
  private apiKey: string | null = null

  initialize(apiKey: string) {
    this.apiKey = apiKey
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Only for client-side usage
    })
  }

  isInitialized(): boolean {
    return this.openai !== null && this.apiKey !== null
  }

  async generateInsights(
    budgetItems: BudgetItem[],
    categories: BudgetCategory[],
    totalIncome: number,
    totalExpenses: number
  ): Promise<AIInsight[]> {
    if (!this.isInitialized()) {
      throw new Error('AI service not initialized')
    }

    try {
      const prompt = this.buildInsightPrompt(budgetItems, categories, totalIncome, totalExpenses)
      
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor AI that provides actionable insights based on budget data. Always provide specific, actionable advice with confidence scores.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      return this.parseInsights(content)
    } catch (error) {
      console.error('Error generating insights:', error)
      throw error
    }
  }

  async generateBlogPost(
    topic: string,
    budgetData: { items: BudgetItem[]; categories: BudgetCategory[] },
    style: 'professional' | 'casual' | 'technical' = 'professional'
  ): Promise<AIGeneratedContent> {
    if (!this.isInitialized()) {
      throw new Error('AI service not initialized')
    }

    try {
      const prompt = this.buildBlogPrompt(topic, budgetData, style)
      
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a financial blogger who creates engaging, informative content about personal finance and budgeting. Write in a clear, accessible style with practical advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from AI')
      }

      return {
        type: 'blog_post',
        title: this.extractTitle(content),
        content: content,
        tags: this.extractTags(content, topic),
        status: 'draft',
      }
    } catch (error) {
      console.error('Error generating blog post:', error)
      throw error
    }
  }

  async generateSummary(
    budgetItems: BudgetItem[],
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('AI service not initialized')
    }

    try {
      const prompt = `Generate a concise ${period}ly financial summary based on this budget data: ${JSON.stringify(budgetItems)}`
      
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst. Provide clear, concise summaries of financial data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 500,
      })

      return response.choices[0]?.message?.content || 'Unable to generate summary'
    } catch (error) {
      console.error('Error generating summary:', error)
      throw error
    }
  }

  private buildInsightPrompt(
    budgetItems: BudgetItem[],
    categories: BudgetCategory[],
    totalIncome: number,
    totalExpenses: number
  ): string {
    return `
    Analyze this budget data and provide 3-5 actionable insights:
    
    Budget Items: ${JSON.stringify(budgetItems)}
    Categories: ${JSON.stringify(categories)}
    Total Income: $${totalIncome}
    Total Expenses: $${totalExpenses}
    
    For each insight, provide:
    - Type (spending_pattern, budget_alert, saving_opportunity, trend_analysis)
    - Title (brief, actionable)
    - Description (detailed explanation)
    - Confidence (0-100)
    - Actionable (true/false)
    - Action text (if actionable)
    - Impact (low/medium/high)
    
    Format as JSON array.
    `
  }

  private buildBlogPrompt(
    topic: string,
    budgetData: { items: BudgetItem[]; categories: BudgetCategory[] },
    style: string
  ): string {
    return `
    Write a ${style} blog post about "${topic}" incorporating insights from this budget data:
    
    Budget Data: ${JSON.stringify(budgetData)}
    
    Requirements:
    - 800-1200 words
    - Include practical tips
    - Use real examples from the data
    - Make it engaging and informative
    - Include a compelling title
    - Add relevant tags
    `
  }

  private parseInsights(content: string): AIInsight[] {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        return parsed.map(insight => ({
          ...insight,
          id: Date.now().toString() + Math.random(),
          timestamp: Date.now(),
        }))
      }
    } catch {
      // If JSON parsing fails, create a default insight
      return [{
        id: Date.now().toString(),
        type: 'trend_analysis',
        title: 'AI Analysis Available',
        description: content,
        confidence: 75,
        actionable: false,
        timestamp: Date.now(),
        impact: 'medium',
      }]
    }
    
    return []
  }

  private extractTitle(content: string): string {
    const lines = content.split('\n')
    const titleLine = lines.find(line => line.startsWith('#') || line.startsWith('##'))
    return titleLine ? titleLine.replace(/^#+\s*/, '') : 'Generated Blog Post'
  }

  private extractTags(content: string, topic: string): string[] {
    const commonTags = ['finance', 'budgeting', 'personal-finance', 'money-management']
    const topicTags = topic.toLowerCase().split(' ').filter(word => word.length > 3)
    return [...commonTags, ...topicTags].slice(0, 5)
  }
}

export const aiService = new AIService()
