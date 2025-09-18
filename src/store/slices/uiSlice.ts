import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  currentPage: string
  notifications: Notification[]
  modals: {
    addTransaction: boolean
    addCategory: boolean
    settings: boolean
    aiInsights: boolean
  }
  loading: {
    global: boolean
    transactions: boolean
    categories: boolean
    ai: boolean
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  currentPage: 'dashboard',
  notifications: [],
  modals: {
    addTransaction: false,
    addCategory: false,
    settings: false,
    aiInsights: false,
  },
  loading: {
    global: false,
    transactions: false,
    categories: false,
    ai: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload
    },
    
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      }
      state.notifications.unshift(notification)
    },
    
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    clearAllNotifications: (state) => {
      state.notifications = []
    },
    
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true
    },
    
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false
      })
    },
    
    setLoading: (state, action: PayloadAction<{ key: keyof UIState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value
    },
    
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setCurrentPage,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
} = uiSlice.actions

export default uiSlice.reducer
