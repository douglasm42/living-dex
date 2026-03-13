import './Generation.css'

import React from 'react'
import Box from './Box'
import { type GenData, type PokemonData } from '../lib/PokemonData'

function boxesTitleSequence(allPokemons: PokemonData[], title: string): (p: PokemonData[], index: number) => string {
  return (_, index) => allPokemons.length > 30 ? `${title} ${index + 1}` : title
}

function buildBoxes(
  boxes: React.ReactNode[],
  pokemons: PokemonData[],
  titleGen: (p: PokemonData[], index: number) => string,
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
): void {
  buildBoxes(boxes, pokemons, boxesTitleSequence(pokemons, title))
}

function buildSpeciesBoxes(
  boxes: React.ReactNode[],
  gen: GenData,
  ids: number[],
  title: string,
): void {
  if(ids[0] <= gen.first || ids[0] >= gen.last) {
    return
  }

  buildSimpleBoxes(boxes, gen.pokemons.varieties.filter( p => ids.includes(p.id)), title)
}

interface GenerationProps {
  gen: GenData
}

export default function Generation({ gen }: GenerationProps) {
  const boxes: React.ReactNode[] = []

  const pokemons = gen.pokemons.default
  buildBoxes(boxes, pokemons, (pokemons) => `${pokemons.at(0)?.id}..${pokemons.at(-1)?.id}`)

  const genFemales = gen.pokemons.females
  buildSimpleBoxes(boxes, genFemales, 'Females')

  const varietiesIgnore = [25, 201, 493, 676, 666, 669, 670, 671, 773, 869]

  const genVarieties = gen.pokemons.varieties.filter( p => !varietiesIgnore.includes(p.id))
  buildSimpleBoxes(boxes, genVarieties, 'Varieties')

  buildSimpleBoxes(boxes, gen.pokemons.varietiesFemales, 'Varieties')

  buildSpeciesBoxes(boxes, gen, [25], 'Cap Pikachu')
  buildSpeciesBoxes(boxes, gen, [201], 'Unown')
  buildSpeciesBoxes(boxes, gen, [676], 'Furfrou')
  buildSpeciesBoxes(boxes, gen, [666], 'Vivillon')
  buildSpeciesBoxes(boxes, gen, [669, 670, 671], 'Florges')
  buildSpeciesBoxes(boxes, gen, [869], 'Alcremie')

  gen.regions.forEach( region => {
    buildSimpleBoxes(boxes, gen.pokemons.regionalForms, region)
  })

  return (
    <div className='generation-container' key={gen.title}>
      <h1 className='generation-title'>{gen.title}</h1>
      <hr className='divider' />
      <div className='generation-box-container'>
        {boxes}
      </div>
    </div>
  )
}
