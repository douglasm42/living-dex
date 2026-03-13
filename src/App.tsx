import { useState } from 'react'
import Generation from './components/Generation'
import Save from './components/Save'
import { storage } from './lib/storage'
import { GENERATIONS } from './lib/PokemonData'

function App() {
  const [pokemonsCatched, setPokemonsCatched] = useState<Record<string, boolean>>({})

  const onToggleCatched = (uuid: string, catched: boolean) => {
    const newState = {
      ...pokemonsCatched,
      [uuid]: catched,
    }
    setPokemonsCatched(newState)
    storage.setCatched(uuid, catched)
  }

  const generations = GENERATIONS.map( gen => {
    return (
      <Generation key={gen.title} gen={gen} pokemonState={{pokemonsCatched, onToggleCatched}} />
    )
  })

  const onImport = (value: string) => {
    storage.import(value)
    setPokemonsCatched(storage.pokemons)
  }

  return (
    <div>
      <Save onImport={onImport} />
      {generations}
    </div>
  )
}

export default App
