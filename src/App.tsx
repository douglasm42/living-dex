import { useState } from 'react'
import Generation from './components/Generation'
import Save from './components/Save'
import { storage } from './lib/storage'
import { GENERATIONS } from './lib/PokemonData'
import type { Notification, NotificationColor } from './components/Notifications'
import Notifications from './components/Notifications'

function nextId(notifications: Notification[]) {
  return notifications.reduce(function (a, b) {
    return Math.max(a, b.key);
  }, 0) + 1;
}

function App() {
  const [version, setVersion] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const generations = GENERATIONS.map( gen => {
    return (
      <Generation key={`${gen.title}-${version}`} gen={gen} />
    )
  })

  const dismissNotification = (key: number) => {
    return () => {
      const ni = notifications.findIndex( n => n.key === key)
      setNotifications([...notifications.slice(0, ni), ...notifications.slice(ni+1)])
    }
  }

  const addNotification = (message: string, color: NotificationColor) => {
    const key = nextId(notifications)
    setNotifications(notifications.concat([{
      key: key,
      message: message,
      color: color,
      timeout: 3000,
      onDismiss: dismissNotification(key),
    }]))
  }

  const onImport = (value: string) => {
    if(storage.isValid(value)) {
      storage.load(value)
      setVersion(version + 1)
      addNotification('Loaded Save!', 'green')
      return true
    } else {
      addNotification('Invalid Save!', 'red')
      return false
    }
  }

  return (
    <div>
      <Notifications notifications={notifications} />
      <Save onImport={onImport} />
      {generations}
    </div>
  )
}

export default App
