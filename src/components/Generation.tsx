import React from 'react'
import Box from './Box'
import { genericPokemonTitle, onlySubTitle, parseToPokemonProps, REGION_NAMES, type GenData, type PokemonData, type PokemonStringifier } from '../lib/PokemonData'
import Badge from './Badge'
import Section from './Section'

function boxesTitleSequence(allPokemons: (PokemonData | null)[], title: string): (p: (PokemonData | null)[], index: number) => string {
  return (_, index) => allPokemons.length > 30 ? `${title} ${index + 1}` : title
}

function buildBoxes(
  boxes: React.ReactNode[],
  pokemons: (PokemonData | null)[],
  boxTitleGen: (p: (PokemonData | null)[], index: number) => string,
  pokemonTitleGen?: PokemonStringifier,
  pokemonSubTitleGen?: PokemonStringifier,
): void {
  let pokemonsLeft = pokemons
  let index = 0
  while(pokemonsLeft.length > 0) {
    const pokemonsSlice = pokemonsLeft.slice(0, 30)
    const title = boxTitleGen(pokemonsSlice, index)

    const pokemonsProps = pokemonsSlice.map( p => parseToPokemonProps(p, pokemonTitleGen, pokemonSubTitleGen))

    boxes.push(
      <Box 
        title={title} 
        key={title} 
        pokemons={pokemonsProps} 
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
  pokemonTitleGen?: PokemonStringifier,
  pokemonSubTitleGen?: PokemonStringifier,
): void {
  buildBoxes(boxes, pokemons, boxesTitleSequence(pokemons, title), pokemonTitleGen, pokemonSubTitleGen)
}

function buildSpeciesBoxes(
  boxes: React.ReactNode[],
  gen: GenData,
  ids: number[],
  title: string,
  pokemonTitleGen?: PokemonStringifier,
  pokemonSubTitleGen?: PokemonStringifier,
): void {
  if(ids[0] <= gen.first || ids[0] >= gen.last) {
    return
  }

  buildSimpleBoxes(boxes, gen.pokemons.varieties.filter( p => ids.includes(p.id)), title, pokemonTitleGen, pokemonSubTitleGen)
}

interface GenerationProps {
  gen: GenData
}

export default function Generation({ gen }: GenerationProps) {
  const boxes: React.ReactNode[] = []

  const pokemons = gen.pokemons.default
  buildBoxes(boxes, pokemons, (pokemons) => `${pokemons.at(0)?.id}..${pokemons.at(-1)?.id}`, genericPokemonTitle)

  const genFemales = gen.pokemons.females
  buildSimpleBoxes(boxes, genFemales, 'Females')

  const varietiesIgnore = [25, 201, 493, 676, 666, 669, 670, 671, 773, 869]

  const genVarieties = gen.pokemons.varieties.filter( p => !varietiesIgnore.includes(p.id))
  buildSimpleBoxes(boxes, genVarieties, 'Varieties', p => p.title, onlySubTitle)

  buildSpeciesBoxes(boxes, gen, [25], 'Cap Pikachu', onlySubTitle)
  buildSpeciesBoxes(boxes, gen, [201], 'Unown', onlySubTitle)
  buildSpeciesBoxes(boxes, gen, [676], 'Furfrou', onlySubTitle)
  buildSpeciesBoxes(boxes, gen, [666], 'Vivillon', onlySubTitle)
  buildSpeciesBoxes(boxes, gen, [669, 670, 671], 'Florges')

  const alcremieFlavorRegex = /^(.+? .+?) (.+? .+?)$/
  const alcremieTitle: PokemonStringifier = (p) => (p.subTitle?.match(alcremieFlavorRegex)?.[1] || 'Undefined')
  const alcremieSubTitle: PokemonStringifier = (p) => (p.subTitle?.match(alcremieFlavorRegex)?.[2] || 'Undefined')
  buildSpeciesBoxes(boxes, gen, [869], 'Alcremie', alcremieTitle, alcremieSubTitle)

  gen.regions.forEach( region => {
    buildSimpleBoxes(
      boxes,
      gen.pokemons.regionalForms.filter( p => p.region == region ),
      REGION_NAMES[region],
      p => p.title,
      p => p.subTitle || '',
    )
  })

  const games = gen.games.map( g => <Badge style={{ fontSize: '0.8em' }} key={g.name} color={g.color} backgroundColor={g.backgroundColor} >{g.name}</Badge>)

  const subTitle = <React.Fragment>{gen.subTitle} - {games}</React.Fragment>

  return (
    <Section title={gen.title} subTitle={subTitle}>
      {boxes}
    </Section>
  )
}
