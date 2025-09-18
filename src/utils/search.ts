import Fuse from 'fuse.js'
import { BudgetItem } from '@/store/slices/budgetSlice'
import { AIGeneratedContent } from '@/store/slices/aiSlice'

// Search configuration for budget items
const budgetItemSearchConfig: Fuse.IFuseOptions<BudgetItem> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'category', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
}

// Search configuration for AI-generated content
const contentSearchConfig: Fuse.IFuseOptions<AIGeneratedContent> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'content', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true,
}

export class SearchService {
  private budgetItemFuse: Fuse<BudgetItem> | null = null
  private contentFuse: Fuse<AIGeneratedContent> | null = null

  // Initialize search indexes
  initialize(budgetItems: BudgetItem[], content: AIGeneratedContent[]) {
    this.budgetItemFuse = new Fuse(budgetItems, budgetItemSearchConfig)
    this.contentFuse = new Fuse(content, contentSearchConfig)
  }

  // Search budget items
  searchBudgetItems(query: string): Fuse.FuseResult<BudgetItem>[] {
    if (!this.budgetItemFuse || !query.trim()) {
      return []
    }
    return this.budgetItemFuse.search(query)
  }

  // Search AI-generated content
  searchContent(query: string): Fuse.FuseResult<AIGeneratedContent>[] {
    if (!this.contentFuse || !query.trim()) {
      return []
    }
    return this.contentFuse.search(query)
  }

  // Advanced search with filters
  advancedSearch(
    query: string,
    filters: {
      type?: 'income' | 'expense'
      category?: string
      dateRange?: { start: Date; end: Date }
      amountRange?: { min: number; max: number }
    }
  ): Fuse.FuseResult<BudgetItem>[] {
    if (!this.budgetItemFuse) {
      return []
    }

    let results = this.budgetItemFuse.search(query)

    // Apply filters
    if (filters.type) {
      results = results.filter(result => result.item.type === filters.type)
    }

    if (filters.category) {
      results = results.filter(result => result.item.category === filters.category)
    }

    if (filters.dateRange) {
      results = results.filter(result => {
        const itemDate = new Date(result.item.date)
        return itemDate >= filters.dateRange!.start && itemDate <= filters.dateRange!.end
      })
    }

    if (filters.amountRange) {
      results = results.filter(result => {
        return result.item.amount >= filters.amountRange!.min && 
               result.item.amount <= filters.amountRange!.max
      })
    }

    return results
  }

  // Get search suggestions
  getSuggestions(query: string, type: 'budget' | 'content' = 'budget'): string[] {
    const suggestions: string[] = []
    
    if (type === 'budget') {
      // Get unique categories and names for suggestions
      const budgetItems = this.budgetItemFuse?.getIndex().docs || []
      const categories = [...new Set(budgetItems.map((item: any) => item.category))]
      const names = [...new Set(budgetItems.map((item: any) => item.name))]
      
      suggestions.push(...categories, ...names)
    } else {
      // Get unique tags and titles for content suggestions
      const content = this.contentFuse?.getIndex().docs || []
      const tags = [...new Set(content.flatMap((item: any) => item.tags || []))]
      const titles = content.map((item: any) => item.title)
      
      suggestions.push(...tags, ...titles)
    }

    // Filter and sort suggestions
    return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
  }

  // Update search indexes
  updateBudgetItems(budgetItems: BudgetItem[]) {
    this.budgetItemFuse = new Fuse(budgetItems, budgetItemSearchConfig)
  }

  updateContent(content: AIGeneratedContent[]) {
    this.contentFuse = new Fuse(content, contentSearchConfig)
  }
}

export const searchService = new SearchService()
