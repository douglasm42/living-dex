import untypedPokemonsData from '../assets/pokemons_data.json'
import atlasSpriteMap from '../assets/atlas_sprite_map.json'
import type { PokemonProps } from '../components/Pokemon'

export interface PokemonData {
  id: number
  prefix: string | null
  title: string
  subTitle: string | null
  name: string
  variation: string | null
  imagePath: string
  region: string | null
  uuid: string
}

export const ALL_POKEMONS_DATA: {
  defaultPokemons: PokemonData[]
  defaultFemalePokemons: PokemonData[]
  varieties: PokemonData[]
} = untypedPokemonsData

export const ATLAS_SPRITE_MAP: Record<string, { sheet: number, x: number, y: number }> = atlasSpriteMap

export const DEFAULT_POKEMONS = ALL_POKEMONS_DATA.defaultPokemons
export const DEFAULT_FEMALE_POKEMONS = ALL_POKEMONS_DATA.defaultFemalePokemons
export const VARIETIES = ALL_POKEMONS_DATA.varieties

export const ALL_POKEMONS = DEFAULT_POKEMONS.concat(DEFAULT_FEMALE_POKEMONS, VARIETIES)

export const POKEMON_UUID_MAP: Record<string, PokemonData> = {}
ALL_POKEMONS.forEach( p => POKEMON_UUID_MAP[p.uuid] = p)

export const REGION_NAMES: Record<string, string> = {
  'kanto': 'Kanto Region Forms',
  'johto': 'Johto Region Forms',
  'hoenn': 'Hoenn Region Forms',
  'sinnoh': 'Sinnoh Form',
  'unova': 'Unova Form',
  'kalos': 'Kalos Form',
  'alola': 'Alolan Forms',
  'galar': 'Galarian Forms',
  'hisui': 'Hisuian Forms',
  'paldea': 'Paldean Forms',
  'gmax': 'Gigantamax',
}

interface GenParams {
  id: string
  title: string
  subTitle: string
  smallTitle: string
  games: PokemonGame[]
  first: number
  last: number
  regions: string[]
}

interface PokemonsRegionSet {
  default: PokemonData[]
  females: PokemonData[]
  varieties: PokemonData[]
  regionalForms: PokemonData[]
}

export interface GenData extends GenParams {
  pokemons: PokemonsRegionSet
}

export function genericPokemonTitle(p: PokemonData): string {
  if(p.subTitle === null) {
    return p.title
  }
  return `${p.title} ${p.subTitle}`
}

export function onlySubTitle(p: PokemonData): string {
  if(p.subTitle === null) {
    return p.title
  }
  return p.subTitle
}

export type PokemonStringifier = (p: PokemonData) => string

export interface ParseToPokemonPropsOptions {
  genTitle?: PokemonStringifier
  genSubTitle?: PokemonStringifier
}

export function parseToPokemonProps(p: PokemonData | null, { genTitle, genSubTitle }: ParseToPokemonPropsOptions): (PokemonProps | null) {
  if(!p) { return null }

  return {
    id: p.id.toString(),
    name: (genTitle || genericPokemonTitle)(p),
    imagePath: p.imagePath,
    uuid: p.uuid,
    subTitle: genSubTitle ? genSubTitle(p) : undefined,
    icon: p.variation?.split('-').includes('f') ? 'venus' : undefined,
  }
}

function idInRange(first: number, last: number): (pokemon: PokemonData) => boolean {
  return (pokemon: PokemonData) => {
    return pokemon.id >= first && pokemon.id <= last && pokemon.region === null
  }
}

function belongsToRegions(regions: string[]): (pokemon: PokemonData) => boolean {
  return (pokemon: PokemonData) => {
    return pokemon.region !== null && regions.includes(pokemon.region)
  }
}

function pokemonsOnGeneration({ first, last, regions}: GenParams) {
  return {
    default: DEFAULT_POKEMONS.filter(idInRange(first, last)),
    females: DEFAULT_FEMALE_POKEMONS.filter(idInRange(first, last)),
    varieties: VARIETIES.filter(idInRange(first, last)),
    regionalForms: VARIETIES.filter(belongsToRegions(regions)),
  }
}

function buildGen(gen: GenParams): GenData {
  return {
    ...gen,
    pokemons: pokemonsOnGeneration(gen)
  }
}

export interface PokemonGame {
  gen: number
  name: string
  color: string
  backgroundColor: string
}

export const GAMES: Record<string, PokemonGame> = {
  red: {
    gen: 1,
    name: 'Red',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  green: {
    gen: 1,
    name: 'Green',
    color: 'var(--cp-green)',
    backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)',
  },
  blue: {
    gen: 1,
    name: 'Blue',
    color: 'var(--cp-blue)',
    backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)',
  },
  yellow: {
    gen: 1,
    name: 'Yellow',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  fireRed: {
    gen: 1,
    name: 'FireRed',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  leafGreen: {
    gen: 1,
    name: 'LeafGreen',
    color: 'var(--cp-green)',
    backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)',
  },
  pikachu: {
    gen: 1,
    name: "Let's Go, Pikachu!",
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  eevee: {
    gen: 1,
    name: "Let's Go, Eevee!",
    color: 'var(--cp-rosewater)',
    backgroundColor: 'color-mix(in srgb, var(--cp-rosewater) 20%, transparent)',
  },
  gold: {
    gen: 2,
    name: 'Gold',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  silver: {
    gen: 2,
    name: 'Silver',
    color: '#4c4f69',
    backgroundColor: '#dce0e8',
  },
  crystal: {
    gen: 2,
    name: 'Crystal',
    color: 'var(--cp-teal)',
    backgroundColor: 'color-mix(in srgb, var(--cp-teal) 20%, transparent)',
  },
  heartGold: {
    gen: 2,
    name: 'HeartGold',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  soulSilver: {
    gen: 2,
    name: 'SoulSilver',
    color: '#4c4f69',
    backgroundColor: '#dce0e8',
  },
  ruby: {
    gen: 3,
    name: 'Ruby',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  sapphire: {
    gen: 3,
    name: 'Sapphire',
    color: 'var(--cp-sapphire)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sapphire) 20%, transparent)',
  },
  emerald: {
    gen: 3,
    name: 'Emerald',
    color: 'var(--cp-green)',
    backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)',
  },
  omegaRuby: {
    gen: 3,
    name: 'Omega Ruby',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  alphaSapphire: {
    gen: 3,
    name: 'Alpha Sapphire',
    color: 'var(--cp-sapphire)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sapphire) 20%, transparent)',
  },
  diamond: {
    gen: 4,
    name: 'Diamond',
    color: 'var(--cp-lavender)',
    backgroundColor: 'color-mix(in srgb, var(--cp-lavender) 20%, transparent)',
  },
  pearl: {
    gen: 4,
    name: 'Pearl',
    color: 'var(--cp-flamingo)',
    backgroundColor: 'color-mix(in srgb, var(--cp-flamingo) 20%, transparent)',
  },
  platinum: {
    gen: 4,
    name: 'Platinum',
    color: 'var(--cp-rosewater)',
    backgroundColor: 'color-mix(in srgb, var(--cp-rosewater) 20%, transparent)',
  },
  brilliantDiamond: {
    gen: 4,
    name: 'Brilliant Diamond',
    color: 'var(--cp-lavender)',
    backgroundColor: 'color-mix(in srgb, var(--cp-lavender) 20%, transparent)',
  },
  shiningPearl: {
    gen: 4,
    name: 'Shining Pearl',
    color: 'var(--cp-flamingo)',
    backgroundColor: 'color-mix(in srgb, var(--cp-flamingo) 20%, transparent)',
  },
  black: {
    gen: 5,
    name: 'Black',
    color: '#dce0e8',
    backgroundColor: '#232323',
  },
  white: {
    gen: 5,
    name: 'White',
    color: '#232323',
    backgroundColor: '#dce0e8',
  },
  black2: {
    gen: 5,
    name: 'Black 2',
    color: '#dce0e8',
    backgroundColor: '#232323',
  },
  white2: {
    gen: 5,
    name: 'White 2',
    color: '#232323',
    backgroundColor: '#dce0e8',
  },
  x: {
    gen: 6,
    name: 'X',
    color: 'var(--cp-blue)',
    backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)',
  },
  y: {
    gen: 6,
    name: 'Y',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  sun: {
    gen: 7,
    name: 'Sun',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  moon: {
    gen: 7,
    name: 'Moon',
    color: 'var(--cp-sky)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sky) 20%, transparent)',
  },
  ultraSun: {
    gen: 7,
    name: 'Ultra Sun',
    color: 'var(--cp-yellow)',
    backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)',
  },
  ultraMoon: {
    gen: 7,
    name: 'Ultra Moon',
    color: 'var(--cp-sky)',
    backgroundColor: 'color-mix(in srgb, var(--cp-sky) 20%, transparent)',
  },
  sword: {
    gen: 8,
    name: 'Sword',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  shield: {
    gen: 8,
    name: 'Shield',
    color: 'var(--cp-blue)',
    backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)',
  },
  arceus: {
    gen: 8,
    name: 'Legends: Arceus',
    color: 'var(--cp-teal)',
    backgroundColor: 'color-mix(in srgb, var(--cp-teal) 20%, transparent)',
  },
  scarlet: {
    gen: 9,
    name: 'Scarlet',
    color: 'var(--cp-red)',
    backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)',
  },
  violet: {
    gen: 9,
    name: 'Violet',
    color: 'var(--cp-mauve)',
    backgroundColor: 'color-mix(in srgb, var(--cp-mauve) 20%, transparent)',
  },
  za: {
    gen: 9,
    name: 'Legends: Z-A',
    color: 'var(--cp-teal)',
    backgroundColor: 'color-mix(in srgb, var(--cp-teal) 20%, transparent)',
  },
}

export const GENERATIONS: GenData[] = [
  buildGen({ id: '1', title: 'Generation I', subTitle: 'Kanto', smallTitle: 'G.I', games: Object.values(GAMES).filter( g => g.gen === 1), first: 1, last: 151, regions: ['kanto'] }),
  buildGen({ id: '2', title: 'Generation II', subTitle: 'Johto', smallTitle: 'G.II', games: Object.values(GAMES).filter( g => g.gen === 2), first: 152, last: 251, regions: ['johto'] }),
  buildGen({ id: '3', title: 'Generation III', subTitle: 'Hoenn', smallTitle: 'G.III', games: Object.values(GAMES).filter( g => g.gen === 3), first: 252, last: 386, regions: ['hoenn'] }),
  buildGen({ id: '4', title: 'Generation IV', subTitle: 'Sinnoh', smallTitle: 'G.IV', games: Object.values(GAMES).filter( g => g.gen === 4), first: 387, last: 493, regions: ['sinnoh'] }),
  buildGen({ id: '5', title: 'Generation V', subTitle: 'Unova', smallTitle: 'G.V', games: Object.values(GAMES).filter( g => g.gen === 5), first: 494, last: 649, regions: ['unova'] }),
  buildGen({ id: '6', title: 'Generation VI', subTitle: 'Kalos', smallTitle: 'G.VI', games: Object.values(GAMES).filter( g => g.gen === 6), first: 650, last: 721, regions: ['kalos'] }),
  buildGen({ id: '7', title: 'Generation VII', subTitle: 'Alola', smallTitle: 'G.VII', games: Object.values(GAMES).filter( g => g.gen === 7), first: 722, last: 809, regions: ['alola'] }),
  buildGen({ id: '8', title: 'Generation VIII', subTitle: 'Galar', smallTitle: 'G.VIII', games: Object.values(GAMES).filter( g => g.gen === 8), first: 810, last: 905, regions: ['galar', 'hisui', 'gmax'] }),
  buildGen({ id: '9', title: 'Generation IX', subTitle: 'Paldea', smallTitle: 'G.IX', games: Object.values(GAMES).filter( g => g.gen === 9), first: 906, last: 1025, regions: ['paldea'] }),
]

export function getGeneration(uuid: string): GenData | undefined {
  const pokemon = POKEMON_UUID_MAP[uuid]
  if(!pokemon) {
    return undefined
  }

  return GENERATIONS.find( g => (
    (g.first <= pokemon.id && g.last >= pokemon.id && pokemon.region === null) ||
    (pokemon.region !== null && g.regions.includes(pokemon.region))
  ))
}

function bp(base: PokemonData, changes: Partial<PokemonData>): PokemonData {
  return {
    ...base,
    ...changes,
  }
}

function findPokemon(id: number): PokemonData {
  return DEFAULT_POKEMONS.find( p => p.id === id ) as PokemonData
}

const ditto = findPokemon(132)
const natures: string[] = [
  'Hardy' ,'Lonely','Adamant','Naughty','Brave',
  'Bold'  ,'Docile','Impish' ,'Lax'    ,'Relaxed',
  'Modest','Mild'  ,'Bashful','Rash'   ,'Quiet',
  'Calm'  ,'Gentle','Careful','Quirky' ,'Sassy',
  'Timid' ,'Hasty' ,'Jolly'  ,'Naive'  ,'Serious',
]

function makeDitto(nature: string): PokemonData {
  return bp(ditto, { uuid: `${ditto.id}-${nature.toLowerCase()}`, title: nature })
}

export const DITTOES: (PokemonData | null)[] = [
  makeDitto(natures[0]),  makeDitto(natures[1]),  makeDitto(natures[2]),  makeDitto(natures[3]),  makeDitto(natures[4]), null,
  makeDitto(natures[5]),  makeDitto(natures[6]),  makeDitto(natures[7]),  makeDitto(natures[8]),  makeDitto(natures[9]), null,
  makeDitto(natures[10]), makeDitto(natures[11]), makeDitto(natures[12]), makeDitto(natures[13]), makeDitto(natures[14]), null,
  makeDitto(natures[15]), makeDitto(natures[16]), makeDitto(natures[17]), makeDitto(natures[18]), makeDitto(natures[19]), null,
  makeDitto(natures[20]), makeDitto(natures[21]), makeDitto(natures[22]), makeDitto(natures[23]), makeDitto(natures[24]),
]

function makeStarter(id: number): PokemonData {
  const pokemon = findPokemon(id)
  return bp(pokemon, { uuid: `${pokemon.id}-starter` })
}

export const STARTERS: (PokemonData | null)[] = [
  makeStarter(1),   makeStarter(1 + 3),   makeStarter(1 + 6),   makeStarter(650), makeStarter(650 + 3), makeStarter(650 + 6),
  makeStarter(152), makeStarter(152 + 3), makeStarter(152 + 6), makeStarter(722), makeStarter(722 + 3), makeStarter(722 + 6),
  makeStarter(252), makeStarter(252 + 3), makeStarter(252 + 6), makeStarter(810), makeStarter(810 + 3), makeStarter(810 + 6),
  makeStarter(387), makeStarter(387 + 3), makeStarter(387 + 6), makeStarter(906), makeStarter(906 + 3), makeStarter(906 + 6),
  makeStarter(495), makeStarter(495 + 3), makeStarter(495 + 6),
]

export const EEVEE_EVOLUTIONS: (PokemonData | null)[] = [
  makeStarter(133),
  makeStarter(134),
  makeStarter(135),
  makeStarter(136),
  makeStarter(196),
  makeStarter(197),
  makeStarter(470),
  makeStarter(471),
  makeStarter(700),
]
