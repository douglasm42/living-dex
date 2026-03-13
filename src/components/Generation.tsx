import './Generation.css'

import React from 'react'
import Box from './Box'
import { DEFAULT_FEMALE_POKEMONS, DEFAULT_POKEMONS, VARIETIES, VARIETIES_FEMALES, type PokemonData } from '../lib/PokemonData'

const REGION_NAMES: Record<string, string> = {
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

export interface GenInfo {
  title: string,
  first: number,
  last: number,
  regions: string[]
}

function onThisGen(gen: GenInfo): (pokemon: PokemonData) => boolean {
  return (pokemon: PokemonData) => {
    return pokemon.id >= gen.first && pokemon.id <= gen.last && pokemon.region === null
  }
}

function buildBoxes(pokemons: PokemonData[], titleGen: (pokemons: PokemonData[], index: number) => string): React.ReactNode[] {
  const boxes: React.ReactNode[] = []
  let pokemonsLeft = pokemons
  let index = 0
  while(pokemonsLeft.length > 0) {
    const pokemonsSlice = pokemonsLeft.slice(0, 30)
    const title = titleGen(pokemonsSlice, index)

    boxes.push(<Box title={title} key={title} pokemons={pokemonsSlice} />)

    pokemonsLeft = pokemonsLeft.slice(30)
    index++
  }

  return boxes
}

function buildSpecialBox(gen: GenInfo, ids: number[], name: string): React.ReactNode[] {
  const specialGroup = VARIETIES.filter( p => ids.includes(p.id)).filter(onThisGen(gen))
  if(specialGroup.length > 0) {
    return buildBoxes(specialGroup, (_pokemons, i) => specialGroup.length > 30 ? `${name} ${i+1}` : name)
  }
  return []
}

function buildRegionBox(region: string): React.ReactNode[] {
  const name = REGION_NAMES[region]
  const regionGroup = VARIETIES.filter( p => p.region === region)
  if(regionGroup.length > 0) {
    return buildBoxes(regionGroup, (_pokemons, i) => regionGroup.length > 30 ? `${name} ${i+1}` : name)
  }
  return []
}

function buildGenBoxes(gen: GenInfo): React.ReactNode {
  let boxes: React.ReactNode[] = []

  const pokemons = DEFAULT_POKEMONS.filter(onThisGen(gen))
  boxes = boxes.concat(buildBoxes(pokemons, (pokemons) => `${pokemons.at(0)?.id}..${pokemons.at(-1)?.id}`))

  const genFemales = (DEFAULT_FEMALE_POKEMONS.concat(VARIETIES_FEMALES)).filter(onThisGen(gen))
  boxes = boxes.concat(buildBoxes(genFemales, (_pokemons, i) => genFemales.length > 30 ? `Females ${i+1}` : 'Females'))

  const varietiesIgnore = [25, 201, 493, 676, 666, 669, 670, 671, 773, 869]

  const genVarieties = VARIETIES.filter( p => !varietiesIgnore.includes(p.id)).filter(onThisGen(gen))
  if(genVarieties.length > 0) {
    boxes = boxes.concat(buildBoxes(genVarieties, (_pokemons, i) => genVarieties.length > 30 ? `Varieties ${i+1}` : 'Varieties'))
  }

  boxes = boxes.concat(buildSpecialBox(gen, [25], 'Cap Pikachu'))
  boxes = boxes.concat(buildSpecialBox(gen, [201], 'Unown'))
  boxes = boxes.concat(buildSpecialBox(gen, [676], 'Furfrou'))
  boxes = boxes.concat(buildSpecialBox(gen, [666], 'Vivillon'))
  boxes = boxes.concat(buildSpecialBox(gen, [669, 670, 671], 'Florges'))
  boxes = boxes.concat(buildSpecialBox(gen, [869], 'Alcremie'))

  gen.regions.forEach( region => {
    boxes = boxes.concat(buildRegionBox(region))
  })

  return boxes
}

interface GenerationProps {
  gen: GenInfo
}

export default function Generation({ gen }: GenerationProps) {
  const boxes = buildGenBoxes(gen)

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
