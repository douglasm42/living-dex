import untypedPokemonsData from '../assets/pokemons_data.json'

export interface PokemonData {
  id: number,
  name: string,
  title: string,
  imagePath: string,
  region: string | null,
  uuid: string,
}

export const ALL_POKEMONS_DATA: {
  defaultPokemons: PokemonData[]
  defaultFemalePokemons: PokemonData[]
  varieties: PokemonData[]
  varietiesFemales: PokemonData[]
} = untypedPokemonsData

export const DEFAULT_POKEMONS = ALL_POKEMONS_DATA.defaultPokemons
export const DEFAULT_FEMALE_POKEMONS = ALL_POKEMONS_DATA.defaultFemalePokemons
export const VARIETIES = ALL_POKEMONS_DATA.varieties
export const VARIETIES_FEMALES = ALL_POKEMONS_DATA.varietiesFemales
