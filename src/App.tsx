import './App.css'

import { useState } from 'react'
import Generation from './components/Generation'
import Save from './components/Save'
import { storage } from './lib/storage'
import { DITTOES, EEVEE_EVOLUTIONS, GENERATIONS, parseToPokemonProps, STARTERS } from './lib/PokemonData'
import Section from './components/Section'
import Box from './components/Box'
import Instructions from './components/Instructions'
import Search from './components/Search'

function App() {
  const [version, setVersion] = useState(0)

  const generations = GENERATIONS.map( gen => {
    return (
      <Generation key={`${gen.title}-${version}`} gen={gen} />
    )
  })

  const onImport = (value: string) => {
    if(storage.import(value)) {
      setVersion(version + 1)
      return true
    } else {
      return false
    }
  }

  const onClear = () => {
    if(storage.clear()) {
      setVersion(version + 1)
      return true
    } else {
      return false
    }
  }

  const linkTo = (href: string, text: string) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
  )

  const dittoes = DITTOES.map(p => parseToPokemonProps(p, p => p.title))
  const starters = STARTERS.map(p => parseToPokemonProps(p, p => p.title))
  const eeveelutions = EEVEE_EVOLUTIONS.map(p => parseToPokemonProps(p, p => p.title))

  return (
    <div className='app-container'>
      <Save onImport={onImport} onClear={onClear} />
      <h1 className='app-title'>Living Dex <small>{linkTo('https://douglasm42.dev/', 'by douglasm42')}</small></h1>
      <hr className='app-divider' />
      <Instructions />
      {generations}
      <Section key={version} title="Extra Credits" subTitle="Interesting Groups not related to any generation">
        <Box title='Dittoes' description='One of each Nature. Remember to name them after their respective nature.' pokemons={dittoes} />
        <Box title='Starters' description="Gotta choose 'em all!" pokemons={starters} />
        <Box title='Eeveelutions' description='One of each Eevee evolution' pokemons={eeveelutions} />
      </Section>
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
