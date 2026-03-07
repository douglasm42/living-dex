import type { PokemonInfo } from './Box'
import './Generation.css'

import untypedPokemonsData from '../assets/pokemons_data.json'

interface PokemonData {
  id: number,
  name: string,
  imagePath: string,
  region: string | null
}

const ALL_POKEMONS_DATA: {
  defaultPokemons: PokemonData[]
  defaultFemalePokemons: PokemonData[]
  varieties: PokemonData[]
  varietiesFemales: PokemonData[]
} = untypedPokemonsData

const DEFAULT_POKEMONS = ALL_POKEMONS_DATA.defaultPokemons
const DEFAULT_FEMALE_POKEMONS = ALL_POKEMONS_DATA.defaultFemalePokemons
const VARIETIES = ALL_POKEMONS_DATA.varieties
const VARIETIES_FEMALES = ALL_POKEMONS_DATA.varietiesFemales

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


import React from 'react'
import Box from './Box'

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

function buildBoxes(pokemons: PokemonInfo[], titleGen: (pokemons: PokemonInfo[], index: number) => string): React.ReactNode[] {
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

function buildSpecialBox(gen: GenInfo, id: number, name: string): React.ReactNode[] {
  const specialGroup = VARIETIES.filter( p => p.id === id).filter(onThisGen(gen))
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

  const varietiesIgnore = [201, 493, 676, 773, 869]

  const genVarieties = VARIETIES.filter( p => !varietiesIgnore.includes(p.id)).filter(onThisGen(gen))
  if(genVarieties.length > 0) {
    boxes = boxes.concat(buildBoxes(genVarieties, (_pokemons, i) => genVarieties.length > 30 ? `Varieties ${i+1}` : 'Varieties'))
  }

  boxes = boxes.concat(buildSpecialBox(gen, 201, 'Unown'))
  boxes = boxes.concat(buildSpecialBox(gen, 493, 'Arceus'))
  boxes = boxes.concat(buildSpecialBox(gen, 676, 'Furfrou'))
  boxes = boxes.concat(buildSpecialBox(gen, 773, 'Silvally'))
  boxes = boxes.concat(buildSpecialBox(gen, 869, 'Alcremie'))

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
