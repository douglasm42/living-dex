import './App.css'

import { useState } from 'react'
import Generation from './components/Generation'
import Save from './components/Save'
import { storage } from './lib/storage'
import { DITTOES, EEVEE_EVOLUTIONS, GAMES, GENERATIONS, STARTERS } from './lib/PokemonData'
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

  const game = (key: string) => {
    if(key in GAMES) {
      const g = GAMES[key]
      return <code style={{ color: g.color, backgroundColor: g.backgroundColor }}>{g.name}</code>
    }
    return <code>{key}</code>
  }

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
          You can click on the Pokemon card to mark it as catched and also on
          the <code>i</code> button to view more details
          in {linkTo('https://pokemondb.net/', 'pokemondb.net')}.
        </p>
        <p>Here are some useful resources:</p>
        <ul>
          <li>{linkTo('https://pokemondb.net/', 'Pokemon Database')}</li>
          <li>{linkTo('https://bulbapedia.bulbagarden.net/wiki/Main_Page', 'Bulbapedia')}</li>
        </ul>
        <ul>
          <li>Gen I: {game('red')}{game('green')}{game('blue')}{game('yellow')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-i-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-red-blue', 'Map Genie interactive map for Red and Blue')}</li>
            <li>{linkTo('https://pokemondb.net/red-blue/hms', 'Hidden Machines')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen II: {game('gold')}{game('silver')}{game('crystal')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-ii-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://pokemondb.net/gold-silver/hms', 'Hidden Machines')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen III: {game('ruby')}{game('sapphire')}{game('emerald')}{game('fireRed')}{game('leafGreen')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-iii-iv-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-firered-leafgreen', 'Map Genie interactive map for FireRed and LeafGreen')}</li>
            <li>{linkTo('https://pokemondb.net/ruby-sapphire/hms', 'Hidden Machines for')}{game('ruby')}{game('sapphire')}{game('emerald')}</li>
            <li>{linkTo('https://pokemondb.net/firered-leafgreen/hms', 'Hidden Machines for')}{game('fireRed')}{game('leafGreen')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen IV: {game('diamond')}{game('pearl')}{game('platinum')}{game('heartGold')}{game('soulSilver')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-iii-iv-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://pokemondb.net/diamond-pearl/hms', 'Hidden Machines for')}{game('diamond')}{game('pearl')}{game('platinum')}</li>
            <li>{linkTo('https://pokemondb.net/heartgold-soulsilver/hms', 'Hidden Machines for')}{game('heartGold')}{game('soulSilver')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen V: {game('black')}{game('white')}{game('black2')}{game('white2')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-v-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://pokemondb.net/black-white/hms', 'Hidden Machines for')}{game('black')}{game('white')}</li>
            <li>{linkTo('https://pokemondb.net/black-white-2/hms', 'Hidden Machines for')}{game('black2')}{game('white2')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen VI: {game('x')}{game('y')}{game('omegaRuby')}{game('alphaSapphire')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-vi-vii-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://pokemondb.net/x-y/hms', 'Hidden Machines for')}{game('x')}{game('y')}</li>
            <li>{linkTo('https://pokemondb.net/omega-ruby-alpha-sapphire/hms', 'Hidden Machines for')}{game('omegaRuby')}{game('alphaSapphire')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen VII: {game('sun')}{game('moon')}{game('ultraSun')}{game('ultraMoon')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-vi-vii-catch-rate/', 'Catch Rate Calculator')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen VIII: {game('sword')}{game('shield')}{game('arceus')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-viii-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-legends-arceus', 'Map Genie interactive map for')}{game('arceus')}</li>
          </ul>
        </ul>
        <ul>
          <li>Gen IX: {game('scarlet')}{game('violet')}{game('za')}</li>
          <ul>
            <li>{linkTo('https://www.dragonflycave.com/calculators/gen-ix-catch-rate/', 'Catch Rate Calculator')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-scarlet-violet', 'Map Genie interactive map for')}{game('scarlet')}{game('violet')}</li>
            <li>{linkTo('https://mapgenie.io/pokemon-legends-z-a', 'Map Genie interactive map for')}{game('za')}</li>
          </ul>
        </ul>
        <p>
          The source code of this project is here: {linkTo('https://github.com/douglasm42/living-dex', 'github.com/douglasm42/living-dex')}.
          Report bugs by opening an issue there. I just don't promise that I'll be able to fix them. You can also open a PR if you know how to fix it.
        </p>
      </div>
      {generations}
      <Section key={version} title="Extra Credits" subTitle="Interesting Groups not related to any generation">
        <Box title='Dittoes' description='One of each Nature. Remember to name them after their respective nature.' pokemons={DITTOES} />
        <Box title='Starters' description="Gotta choose 'em all!" pokemons={STARTERS} />
        <Box title='Eeveelutions' description='One of each Eevee evolution' pokemons={EEVEE_EVOLUTIONS} />
      </Section>
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
