import type { GenInfo } from './components/Generation'
import Generation from './components/Generation'


const GEN_RANGES: GenInfo[] = [
  {title: 'Gen I - Kanto - Red, Blue', first: 1, last: 151, regions: ['kanto']},
  {title: 'Gen II - Johto - Gold, Silver', first: 152, last: 251, regions: ['johto']},
  {title: 'Gen III - Hoenn - Ruby, Sapphire', first: 252, last: 386, regions: ['hoenn']},
  {title: 'Gen IV - Sinnoh - Diamond, Pearl', first: 387, last: 493, regions: ['sinnoh']},
  {title: 'Gen V - Unova - Black, White', first: 494, last: 649, regions: ['unova']},
  {title: 'Gen VI - Kalos - X, Y', first: 650, last: 721, regions: ['kalos']},
  {title: 'Gen VII - Alola - Sun, Moon', first: 722, last: 809, regions: ['alola']},
  {title: 'Gen VIII - Galar - Sword, Shield', first: 810, last: 905, regions: ['galar', 'hisui']},
  {title: 'Gen IX - Paldea - Scarlet, Violet', first: 906, last: 1025, regions: ['paldea']},
]

function App() {
  const generations = GEN_RANGES.map( gen => {
    return (
      <Generation key={gen.title} gen={gen} />
    )
  })
  return (
    <div>
      {generations}
    </div>
  )
}

export default App
