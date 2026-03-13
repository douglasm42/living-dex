import './Box.css'

import React from 'react'

import Pokemon, { type PokemonsStateProps } from './Pokemon'
import EmptyCell from './EmptyCell'
import type { PokemonData } from '../lib/PokemonData'

interface BoxProps {
  title: string
  pokemons: PokemonData[]
  pokemonState: PokemonsStateProps
}

function row(i: number, arr: PokemonData[], pokemonState: PokemonsStateProps): React.ReactNode[] {
  return addMissing(arr.slice(i*6, (i+1)*6).map(
    (pokemon, i) =>
      <Pokemon 
        key={i} 
        id={pokemon.id.toString()} 
        name={pokemon.title} 
        imagePath={pokemon.imagePath} 
        uuid={pokemon.uuid} 
        icon={pokemon.icon}
        catched={pokemonState.pokemonsCatched[pokemon.uuid]}
        onToggleCatched={pokemonState.onToggleCatched}
      />
    )
  )
}

function addMissing(row: React.ReactNode[]): React.ReactNode[] {
  const from = row.length
  row.length = 6
  for( let i = from ; i < 6 ; i++) {
    row[i] = <EmptyCell key={i} />
  }

  return row
}

export default function Box({ title, pokemons, pokemonState }: BoxProps): React.ReactNode {
  const rows = [
    row(0, pokemons, pokemonState),
    row(1, pokemons, pokemonState),
    row(2, pokemons, pokemonState),
    row(3, pokemons, pokemonState),
    row(4, pokemons, pokemonState),
  ].map( (row, i) => (<div className="box-row" key={i}>{row}</div>) )

  return (
    <div className="box">
      <h2 className='box-title'>{title}</h2>
      {rows}
    </div>
  )
}
