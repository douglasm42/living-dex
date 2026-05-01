import './App.css'

import { useEffect, useState } from 'react'
import SectionRenderer from './components/SectionRenderer'
import Save from './components/Save'
import { storage } from './lib/storage'
import { loadSections, type SectionData } from './lib/DataLoader'
import Instructions from './components/Instructions'
import Search from './components/Search'

function App() {
  const [version, setVersion] = useState(0)
  const [sections, setSections] = useState<SectionData[]>([])

  useEffect(() => {
    loadSections().then(setSections)
  }, [])

  const onImport = (value: string) => {
    if (storage.import(value)) {
      setVersion(version + 1)
      return true
    } else {
      return false
    }
  }

  const onClear = () => {
    if (storage.clear()) {
      setVersion(version + 1)
      return true
    } else {
      return false
    }
  }

  const linkTo = (href: string, text: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
  )

  return (
    <div className='app-container'>
      <Save onImport={onImport} onClear={onClear} />
      <h1 className='app-title'>Living Dex <small>{linkTo('https://douglasm42.dev/', 'by douglasm42')}</small></h1>
      <hr className='app-divider' />
      <Instructions />
      {sections.map((section) => (
        <SectionRenderer key={`${section.title}-${version}`} section={section} />
      ))}
      <hr className='app-divider' />
      <footer className='app-footer'>
        Developed by {linkTo('https://douglasm42.dev/', 'douglasm42')}.<br/>
        Data and images sourced from {linkTo('https://github.com/PokeAPI/api-data', 'PokeAPI/api-data')} and {linkTo('https://github.com/PokeAPI/sprites/blob/master/LICENCE.txt', 'PokeAPI/sprites')}<br/>
        Pokémon images & names © 1995-2026 Nintendo/Game Freak.
      </footer>
      <Search />
    </div>
  )
}

export default App
