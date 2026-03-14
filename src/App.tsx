import './App.css'

import { useState } from 'react'
import Generation from './components/Generation'
import Save from './components/Save'
import { storage } from './lib/storage'
import { DITTOES, EEVEE_EVOLUTIONS, GENERATIONS, STARTERS } from './lib/PokemonData'
import type { Notification, NotificationColor } from './components/Notifications'
import Notifications from './components/Notifications'
import Section from './components/Section'
import Box from './components/Box'

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
    <div className='app-container'>
      <Notifications notifications={notifications} />
      <Save onImport={onImport} />
      <h1 className='app-title'>Living Dex</h1>
      <hr className='app-divider' />
      <div className='app-instructions'>
        <p>
          The data is saved on localstorage. You can use the Copy and Paste button
          up top to save it somewhere safe and then restore it later on in another
          computer.
        </p>
        <p>
          You can click on the Pokemon card to mark it as catched and also on the
          <code>i</code> button to view more details in
          <a href="https://pokemondb.net/" target="_blank">pokemondb.net</a>.
        </p>
      </div>
      <Section title="Cross Generations" subTitle="Interesting Groups not related to any generation">
        <Box title='Dittoes' pokemons={DITTOES} />
        <Box title='Starters' pokemons={STARTERS} />
        <Box title='Eevolutions' pokemons={EEVEE_EVOLUTIONS} />
      </Section>
      {generations}
      <hr className='app-divider' />
      <footer className='app-footer'>
        Pokémon images & names © 1995-2026 Nintendo/Game Freak.
      </footer>
    </div>
  )
}

export default App
