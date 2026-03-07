import './Box.css'

import React from 'react'

import Pokemon from './Pokemon'
import EmptyCell from './EmptyCell'

export interface PokemonInfo {
  id: number,
  name: string,
  imagePath: string,
}

interface BoxProps {
  title: string
  pokemons: PokemonInfo[]
}

function row(i: number, arr: PokemonInfo[]): React.ReactNode[] {
  return addMissing(arr.slice(i*6, (i+1)*6).map( (pokemon, i) => <Pokemon key={i} id={pokemon.id.toString()} name={pokemon.name} imagePath={pokemon.imagePath} />))
}

function addMissing(row: React.ReactNode[]): React.ReactNode[] {
  const from = row.length
  row.length = 6
  for( let i = from ; i < 6 ; i++) {
    row[i] = <EmptyCell key={i} />
  }

  return row
}

export default function Box({ title, pokemons }: BoxProps): React.ReactNode {
  const rows = [
    row(0, pokemons),
    row(1, pokemons),
    row(2, pokemons),
    row(3, pokemons),
    row(4, pokemons),
  ].map( (row, i) => (<div className="box-row" key={i}>{row}</div>) )

  return (
    <div className="box">
      <h2 className='box-title'>{title}</h2>
      {rows}
    </div>
  )
}
