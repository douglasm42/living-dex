import React from 'react'
import Box from './Box'
import { REGION_NAMES, type GenData, type PokemonData } from '../lib/PokemonData'
import Badge from './Badge'
import Section from './Section'

function boxesTitleSequence(allPokemons: (PokemonData | null)[], title: string): (p: (PokemonData | null)[], index: number) => string {
  return (_, index) => allPokemons.length > 30 ? `${title} ${index + 1}` : title
}

function buildBoxes(
  boxes: React.ReactNode[],
  pokemons: (PokemonData | null)[],
  titleGen: (p: (PokemonData | null)[], index: number) => string,
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
    buildSimpleBoxes(boxes, gen.pokemons.regionalForms.filter( p => p.region == region ), REGION_NAMES[region])
  })

  const games = gen.games.map( g => <Badge style={{ fontSize: '0.8em' }} key={g.name} color={g.color} backgroundColor={g.backgroundColor} >{g.name}</Badge>)

  const subTitle = <React.Fragment>{gen.subTitle} - {games}</React.Fragment>

  return (
    <Section title={gen.title} subTitle={subTitle}>
      {boxes}
    </Section>
  )
}
