import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface BudgetItem {
  id: string
  name: string
  amount: number
  category: string
  date: string
  type: 'income' | 'expense'
  description?: string
  tags?: string[]
}

export interface BudgetCategory {
  id: string
  name: string
  color: string
  limit?: number
  spent: number
}

interface BudgetState {
  items: BudgetItem[]
  categories: BudgetCategory[]
  totalIncome: number
  totalExpenses: number
  balance: number
  monthlyBudget: number
  isLoading: boolean
  error: string | null
}

const initialState: BudgetState = {
  items: [],
  categories: [
    { id: '1', name: 'Food & Dining', color: '#ef4444', limit: 500, spent: 0 },
    { id: '2', name: 'Transportation', color: '#3b82f6', limit: 300, spent: 0 },
    { id: '3', name: 'Entertainment', color: '#10b981', limit: 200, spent: 0 },
    { id: '4', name: 'Shopping', color: '#f59e0b', limit: 400, spent: 0 },
    { id: '5', name: 'Utilities', color: '#8b5cf6', limit: 250, spent: 0 },
    { id: '6', name: 'Healthcare', color: '#ec4899', limit: 150, spent: 0 },
  ],
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  monthlyBudget: 2000,
  isLoading: false,
  error: null,
}

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    addBudgetItem: (state, action: PayloadAction<Omit<BudgetItem, 'id'>>) => {
      const newItem: BudgetItem = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.items.push(newItem)
      
      // Update totals
      if (newItem.type === 'income') {
        state.totalIncome += newItem.amount
      } else {
        state.totalExpenses += newItem.amount
        // Update category spent amount
        const category = state.categories.find(cat => cat.name === newItem.category)
        if (category) {
          category.spent += newItem.amount
        }
      }
      
      state.balance = state.totalIncome - state.totalExpenses
    },
    
    updateBudgetItem: (state, action: PayloadAction<BudgetItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        const oldItem = state.items[index]
        const newItem = action.payload
        
        // Update totals
        if (oldItem.type === 'income') {
          state.totalIncome -= oldItem.amount
        } else {
          state.totalExpenses -= oldItem.amount
          const oldCategory = state.categories.find(cat => cat.name === oldItem.category)
          if (oldCategory) {
            oldCategory.spent -= oldItem.amount
          }
        }
        
        if (newItem.type === 'income') {
          state.totalIncome += newItem.amount
        } else {
          state.totalExpenses += newItem.amount
          const newCategory = state.categories.find(cat => cat.name === newItem.category)
          if (newCategory) {
            newCategory.spent += newItem.amount
          }
        }
        
        state.items[index] = newItem
        state.balance = state.totalIncome - state.totalExpenses
      }
    },
    
    deleteBudgetItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        if (item.type === 'income') {
          state.totalIncome -= item.amount
        } else {
          state.totalExpenses -= item.amount
          const category = state.categories.find(cat => cat.name === item.category)
          if (category) {
            category.spent -= item.amount
          }
        }
        state.items = state.items.filter(item => item.id !== action.payload)
        state.balance = state.totalIncome - state.totalExpenses
      }
    },
    
    addCategory: (state, action: PayloadAction<Omit<BudgetCategory, 'id' | 'spent'>>) => {
      const newCategory: BudgetCategory = {
        ...action.payload,
        id: Date.now().toString(),
        spent: 0,
      }
      state.categories.push(newCategory)
    },
    
    updateCategory: (state, action: PayloadAction<BudgetCategory>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id)
      if (index !== -1) {
        state.categories[index] = action.payload
      }
    },
    
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload)
    },
    
    setMonthlyBudget: (state, action: PayloadAction<number>) => {
      state.monthlyBudget = action.payload
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    resetBudget: () => initialState,
  },
})

export const {
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  addCategory,
  updateCategory,
  deleteCategory,
  setMonthlyBudget,
  setLoading,
  setError,
  resetBudget,
} = budgetSlice.actions

export default budgetSlice.reducer
