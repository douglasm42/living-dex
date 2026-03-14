import './App.css'

import { useState } from 'react'
import Generation from './components/Generation'
import Save from './components/Save'
import { storage } from './lib/storage'
import { DITTOES, EEVEE_EVOLUTIONS, GENERATIONS, STARTERS } from './lib/PokemonData'
import Section from './components/Section'
import Box from './components/Box'

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

  return (
    <div className='app-container'>
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
      <Section key={version} title="Cross Generations" subTitle="Interesting Groups not related to any generation">
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
