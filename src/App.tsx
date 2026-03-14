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

  return (
    <div className='app-container'>
      <Save onImport={onImport} onClear={onClear} />
      <h1 className='app-title'>Living Dex <small>{linkTo('https://douglasm42.dev/', 'by douglasm42')}</small></h1>
      <hr className='app-divider' />
      <div className='app-instructions'>
        <p>
          Gotta catch 'em all!
        </p>
        <p>
          The data is saved on localstorage. You can use the Copy and Paste button
          up top to save it somewhere safe and then restore it later on in another
          computer.
        </p>
        <p>
          You can click on the Pokemon card to mark it as catched and also on the
          <code>i</code> button to view more details
          in {linkTo('https://pokemondb.net/', 'pokemondb.net')}.
        </p>
        <p>Here are some useful resources:</p>
        <ul>
          <li>{linkTo('https://pokemondb.net/', 'Pokemon Database')}</li>
          <li>{linkTo('https://bulbapedia.bulbagarden.net/wiki/Main_Page', 'Bulbapedia')}</li>
          <li>Map Genie Guide Maps</li>
          <ul>
            <li>{linkTo('https://mapgenie.io/pokemon-firered-leafgreen', 'FireRed, LeafGreen')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-red-blue', 'Red, Blue')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-legends-arceus', 'Legends: Arceus')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-scarlet-violet', 'Scarlet, Violet')}</li>
          </ul>
          <li>{linkTo('https://mapgenie.io/pokemon-firered-leafgreen', 'Pokemon FireRed & LeafGreen Guide Map')}</li>
          <li>Hidden Machine Charts:</li>
          <ul>
            <li>{linkTo('https://pokemondb.net/red-blue/hms', 'Red, Blue, Yellow')}</li>
            <li>{linkTo('https://pokemondb.net/gold-silver/hms', 'Gold, Silver, Crystal')}</li>
            <li>{linkTo('https://pokemondb.net/ruby-sapphire/hms', 'Ruby, Sapphire, Emerald')}</li>
            <li>{linkTo('https://pokemondb.net/firered-leafgreen/hms', 'FireRed, LeafGreen')}</li>
            <li>{linkTo('https://pokemondb.net/diamond-pearl/hms', 'Diamond, Pearl, Platinum')}</li>
            <li>{linkTo('https://pokemondb.net/heartgold-soulsilver/hms', 'HeartGold, SoulSilver')}</li>
            <li>{linkTo('https://pokemondb.net/black-white/hms', 'Black, White')}</li>
            <li>{linkTo('https://pokemondb.net/black-white-2/hms', 'Black 2, White 2')}</li>
            <li>{linkTo('https://pokemondb.net/x-y/hms', 'X, Y')}</li>
            <li>{linkTo('https://pokemondb.net/omega-ruby-alpha-sapphire/hms', 'Omega Ruby, Alpha Sapphire')}</li>
            <li>HMs are not used beyond these games.</li>
          </ul>
        </ul>
        <p>
          The source code of this project is here: {linkTo('https://github.com/douglasm42/living-dex', 'github.com/douglasm42/living-dex')}.
          Report bugs by opening an issue there. I just don't promise that I'll be able to fix them. You can also open a PR if you know how to fix it.
        </p>
      </div>
      <Section key={version} title="Cross Generations" subTitle="Interesting Groups not related to any generation">
        <Box title='Dittoes' description='One of each Nature. Remember to name them after their respective nature.' pokemons={DITTOES} />
        <Box title='Starters' description="Gotta choose 'em all!" pokemons={STARTERS} />
        <Box title='Eeveelutions' description='One of each Eevee evolution' pokemons={EEVEE_EVOLUTIONS} />
      </Section>
      {generations}
      <hr className='app-divider' />
      <footer className='app-footer'>
        Developed by {linkTo('https://douglasm42.dev/', 'douglasm42')}.<br/>
        Data and images sourced from {linkTo('https://github.com/PokeAPI/api-data', 'PokeAPI/api-data')} and {linkTo('https://github.com/PokeAPI/sprites/blob/master/LICENCE.txt', 'PokeAPI/sprites')}<br/>
        Pokémon images & names © 1995-2026 Nintendo/Game Freak.
      </footer>
    </div>
  )
}

export default App
