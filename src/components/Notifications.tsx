import { X } from 'lucide-react'
import './Notifications.css'

import React, { useEffect, useRef } from 'react'

export type NotificationColor = 'blue' | 'green' | 'yellow' | 'red'

export interface Notification {
  key: number,
  message: React.ReactNode
  color: NotificationColor
  timeout?: number
  onDismiss: () => void
}

interface NotificationsProps {
  notifications: Notification[]
}

function Notification({ key, message, color, timeout, onDismiss}: Notification): React.ReactNode {
  const timeoutRef = useRef<number>(undefined)

  useEffect(() => {
    if(timeout) {
      timeoutRef.current = setTimeout(onDismiss, timeout)
    }
    return () => { clearTimeout(timeoutRef.current) }
  }, [onDismiss, timeout])

  const handleDismiss = () => {
    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      onDismiss()
    }
  }

  return (
    <div key={key} className='notification-container'>
      <div className={`notification-card ${color}`}>
        <button className='notification-dismiss' onClick={handleDismiss}><X size="1em"/></button>
        {message}
      </div>
    </div>
  )
}

export default function Notifications({ notifications }: NotificationsProps): React.ReactNode {
  return (
    <div className='notifications-container'>
      { notifications.map( Notification )}
    </div>
  )
}
