import type { IconName } from 'lucide-react/dynamic'
import untypedPokemonsData from '../assets/pokemons_data.json'

export interface PokemonData {
  id: number,
  name: string,
  title: string,
  imagePath: string,
  region: string | null,
  uuid: string,
  icon?: IconName,
}

export const ALL_POKEMONS_DATA: {
  defaultPokemons: PokemonData[]
  defaultFemalePokemons: PokemonData[]
  varieties: PokemonData[]
  varietiesFemales: PokemonData[]
} = untypedPokemonsData

export const DEFAULT_POKEMONS = ALL_POKEMONS_DATA.defaultPokemons
export const DEFAULT_FEMALE_POKEMONS = ALL_POKEMONS_DATA.defaultFemalePokemons.map( p => {
  p.icon = 'venus'
  return p
})
export const VARIETIES = ALL_POKEMONS_DATA.varieties
export const VARIETIES_FEMALES = ALL_POKEMONS_DATA.varietiesFemales.map( p => {
  p.icon = 'venus'
  return p
})

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
}

interface GenParams {
  title: string,
  first: number,
  last: number,
  regions: string[]
}

interface PokemonsRegionSet {
  default: PokemonData[]
  females: PokemonData[]
  varieties: PokemonData[]
  varietiesFemales: PokemonData[]
  regionalForms: PokemonData[]
}

export interface GenData extends GenParams {
  pokemons: PokemonsRegionSet
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
    varietiesFemales: VARIETIES_FEMALES.filter(idInRange(first, last)),
    regionalForms: VARIETIES.filter(belongsToRegions(regions)).concat(VARIETIES_FEMALES.filter(belongsToRegions(regions))),
  }
}

function buildGen(gen: GenParams): GenData {
  return {
    ...gen,
    pokemons: pokemonsOnGeneration(gen)
  }
}

export const GENERATIONS: GenData[] = [
  buildGen({title: 'Gen I - Kanto - Red, Blue', first: 1, last: 151, regions: ['kanto']}),
  buildGen({title: 'Gen II - Johto - Gold, Silver', first: 152, last: 251, regions: ['johto']}),
  buildGen({title: 'Gen III - Hoenn - Ruby, Sapphire', first: 252, last: 386, regions: ['hoenn']}),
  buildGen({title: 'Gen IV - Sinnoh - Diamond, Pearl', first: 387, last: 493, regions: ['sinnoh']}),
  buildGen({title: 'Gen V - Unova - Black, White', first: 494, last: 649, regions: ['unova']}),
  buildGen({title: 'Gen VI - Kalos - X, Y', first: 650, last: 721, regions: ['kalos']}),
  buildGen({title: 'Gen VII - Alola - Sun, Moon', first: 722, last: 809, regions: ['alola']}),
  buildGen({title: 'Gen VIII - Galar - Sword, Shield', first: 810, last: 905, regions: ['galar', 'hisui']}),
  buildGen({title: 'Gen IX - Paldea - Scarlet, Violet', first: 906, last: 1025, regions: ['paldea']}),
]
