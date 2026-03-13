import './Generation.css'

import React from 'react'
import Box from './Box'
import { type GenData, type PokemonData } from '../lib/PokemonData'
import type { PokemonsStateProps } from './Pokemon'

function boxesTitleSequence(allPokemons: PokemonData[], title: string): (p: PokemonData[], index: number) => string {
  return (_, index) => allPokemons.length > 30 ? `${title} ${index + 1}` : title
}

function buildBoxes(
  boxes: React.ReactNode[],
  pokemons: PokemonData[],
  titleGen: (p: PokemonData[], index: number) => string,
  pokemonState: PokemonsStateProps
): void {
  let pokemonsLeft = pokemons
  let index = 0
  while(pokemonsLeft.length > 0) {
    const pokemonsSlice = pokemonsLeft.slice(0, 30)
    const title = titleGen(pokemonsSlice, index)

    boxes.push(
      <Box 
        title={title} 
        key={title} 
        pokemons={pokemonsSlice} 
        pokemonState={pokemonState} 
      />
    )

    
    pokemonsLeft = pokemonsLeft.slice(30)
    index++
  }
}

function buildSimpleBoxes(
  boxes: React.ReactNode[],
  pokemons: PokemonData[],
  title: string,
  pokemonState: PokemonsStateProps
): void {
  buildBoxes(boxes, pokemons, boxesTitleSequence(pokemons, title), pokemonState)
}

function buildSpeciesBoxes(
  boxes: React.ReactNode[],
  gen: GenData,
  ids: number[],
  title: string,
  pokemonState: PokemonsStateProps
): void {
  if(ids[0] <= gen.first || ids[0] >= gen.last) {
    return
  }

  buildSimpleBoxes(boxes, gen.pokemons.varieties.filter( p => ids.includes(p.id)), title, pokemonState)
}

interface GenerationProps {
  gen: GenData
  pokemonState: PokemonsStateProps
}

export default function Generation({ gen, pokemonState }: GenerationProps) {
  const boxes: React.ReactNode[] = []

  const pokemons = gen.pokemons.default
  buildBoxes(boxes, pokemons, (pokemons) => `${pokemons.at(0)?.id}..${pokemons.at(-1)?.id}`, pokemonState)

  const genFemales = gen.pokemons.females
  buildSimpleBoxes(boxes, genFemales, 'Females', pokemonState)

  const varietiesIgnore = [25, 201, 493, 676, 666, 669, 670, 671, 773, 869]

  const genVarieties = gen.pokemons.varieties.filter( p => !varietiesIgnore.includes(p.id))
  buildSimpleBoxes(boxes, genVarieties, 'Varieties', pokemonState)

  buildSimpleBoxes(boxes, gen.pokemons.varietiesFemales, 'Varieties', pokemonState)

  buildSpeciesBoxes(boxes, gen, [25], 'Cap Pikachu', pokemonState)
  buildSpeciesBoxes(boxes, gen, [201], 'Unown', pokemonState)
  buildSpeciesBoxes(boxes, gen, [676], 'Furfrou', pokemonState)
  buildSpeciesBoxes(boxes, gen, [666], 'Vivillon', pokemonState)
  buildSpeciesBoxes(boxes, gen, [669, 670, 671], 'Florges', pokemonState)
  buildSpeciesBoxes(boxes, gen, [869], 'Alcremie', pokemonState)

  gen.regions.forEach( region => {
    buildSimpleBoxes(boxes, gen.pokemons.regionalForms, region, pokemonState)
  })

  return (
    <div key={gen.title}>
      <h1 className='generation-title'>{gen.title}</h1>
      <hr className='divider' />
      <div className='generation-container'>
        {boxes}
      </div>
    </div>
  )
}
