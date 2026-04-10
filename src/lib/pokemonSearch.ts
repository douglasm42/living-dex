import fuzzy from 'fuzzy'
import { ALL_POKEMONS, type PokemonData } from './PokemonData'

export function findPokemon(pattern: string): PokemonData[] {
  return fuzzy.filter(
    pattern,
    ALL_POKEMONS,
    { extract: p => [p.prefix, p.title, p.subTitle].filter(n => n).join(' ') }
  ).map( r => r.original )
}
