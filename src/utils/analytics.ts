// Analytics service for tracking user interactions and performance
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private isEnabled = true

  // Initialize analytics (can be extended to integrate with Google Analytics, etc.)
  init() {
    if (typeof window !== 'undefined') {
      // Track page views
      this.track('page_view', {
        page: window.location.pathname,
        title: document.title,
      })
    }
  }

  // Track custom events
  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    }

    this.events.push(analyticsEvent)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent)
    }

    // Here you could send to external analytics service
    // this.sendToExternalService(analyticsEvent)
  }

  // Track budget-related events
  trackBudgetEvent(action: string, data?: any) {
    this.track('budget_action', {
      action,
      ...data,
    })
  }

  // Track AI-related events
  trackAIEvent(action: string, data?: any) {
    this.track('ai_action', {
      action,
      ...data,
    })
  }

  // Track user engagement
  trackEngagement(component: string, action: string, data?: any) {
    this.track('engagement', {
      component,
      action,
      ...data,
    })
  }

  // Get analytics data
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  // Clear analytics data
  clear() {
    this.events = []
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  // Private method to send to external service (placeholder)
  private sendToExternalService(event: AnalyticsEvent) {
    // Example: Send to Google Analytics, Mixpanel, etc.
    // gtag('event', event.event, event.properties)
  }
}

export const analytics = new AnalyticsService()
