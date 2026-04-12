import './Box.css'

import React from 'react'

import Pokemon, { type PokemonProps } from './Pokemon'
import EmptyCell from './EmptyCell'

interface BoxProps {
  title: string
  description?: string
  pokemons: (PokemonProps | null)[]
}

function row(i: number, arr: (PokemonProps | null)[]): React.ReactNode[] {
  return addMissing(arr.slice(i*6, (i+1)*6).map(
    (pokemon, i) => {
      if(pokemon) {
        return (
          <Pokemon key={pokemon.uuid} {...pokemon} />
        )
      } else {
        return <EmptyCell key={i} />
      }
    }
  ))
}

function addMissing(row: React.ReactNode[]): React.ReactNode[] {
  const from = row.length
  row.length = 6
  for( let i = from ; i < 6 ; i++) {
    row[i] = <EmptyCell key={i} />
  }

  return row
}

export default function Box({ title, description, pokemons }: BoxProps): React.ReactNode {
  const rows = [
    row(0, pokemons),
    row(1, pokemons),
    row(2, pokemons),
    row(3, pokemons),
    row(4, pokemons),
  ].map( (row, i) => (<div className="box-row" key={i}>{row}</div>) )

  return (
    <article className="box">
      <h2 className='box-title'>{title}</h2>
      {description && <p className='box-description'>{description}</p>}
      {rows}
    </article>
  )
}
