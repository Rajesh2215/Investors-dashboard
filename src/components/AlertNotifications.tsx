import { useState, useEffect } from 'react'
import { type Alert } from '../api/modules/alerts'

interface AlertNotificationsProps {
  alerts: Alert[]
}

const AlertNotifications = ({ alerts }: AlertNotificationsProps) => {
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    // Process new alerts and show notifications (only for non-triggered alerts)
    const newNotifications: string[] = []
    
    alerts.forEach(alert => {
      // Skip alerts that have already been triggered
      if (alert.lastState === 'triggered') {
        return
      }
      
      const message = `Alert triggered: NAV ${alert.direction} ${alert.thresholdValue.toLocaleString()}`
      newNotifications.push(message)
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message, {
          body: `Your NAV threshold has been crossed`,
          icon: '/favicon.svg'
        })
      }
    })

    // Auto-dismiss notifications after 5 seconds
    if (newNotifications.length > 0) {
      setNotifications(newNotifications)
      setTimeout(() => {
        setNotifications([])
      }, 5000)
    }
  }, [alerts])

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
          role="alert"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 00-8 8v2a8 8 0 008 8v2a8 8 0 00-8-8zm-1 1a1 1 0 00-1-1v8a1 1 0 001 1v8a1 1 0 001-1zm-1 9a1 1 0 00-1 1v3a1 1 0 001 1v3a1 1 0 001-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {notification}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setNotifications(prev => prev.filter((_, i) => i !== index))
            }}
            className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 hover:text-green-700 rounded-md p-1.5 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0l-2-2a1 1 0 01-1.414 0L4.293 4.293a1 1 0 001.414 1l2 2a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export default AlertNotifications
