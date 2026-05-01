import React from 'react'
import Box from './Box'
import Badge from './Badge'
import Section from './Section'
import { GAMES, type PokemonGame } from '../lib/PokemonData'
import type { SectionData, PokemonEntry } from '../lib/DataLoader'
import type { PokemonProps } from './Pokemon'

function genTagToNumber(tags: string[]): number | null {
  for (const tag of tags) {
    const match = tag.match(/^gen(\d+)$/)
    if (match) return parseInt(match[1], 10)
  }
  return null
}

function getGamesForSection(section: SectionData): PokemonGame[] {
  const genNum = genTagToNumber(section.tags)
  if (genNum === null) return []
  return Object.values(GAMES).filter((g) => g.gen === genNum)
}

function buildBoxes(subSectionTitle: string, isDefault: boolean, pokemonEntries: PokemonEntry[]): React.ReactNode[] {
  const boxes: React.ReactNode[] = []
  let remaining = [...pokemonEntries]
  let boxIndex = 0

  while (remaining.length > 0) {
    const slice = remaining.slice(0, 30)
    let title: string

    if (isDefault) {
      const firstId = slice[0].id
      const lastId = slice[slice.length - 1].id
      title = `${firstId}..${lastId}`
    } else {
      const total = pokemonEntries.length
      title = total > 30 ? `${subSectionTitle} ${boxIndex + 1}` : subSectionTitle
    }

    const pokemonProps: (PokemonProps | null)[] = slice.map((entry) => ({
      id: entry.id.toString(),
      name: entry.name,
      image: entry.image,
      uuid: entry.uuid,
    }))

    boxes.push(
      <Box title={title} key={title} pokemons={pokemonProps} />
    )

    remaining = remaining.slice(30)
    boxIndex++
  }

  return boxes
}

interface SectionRendererProps {
  section: SectionData
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const boxes: React.ReactNode[] = []

  for (const subSection of section.sub_sections) {
    if (subSection.pokemons.length === 0) continue

    const isDefault = subSection.title === 'Default'
    boxes.push(...buildBoxes(subSection.title, isDefault, subSection.pokemons))
  }

  const games = getGamesForSection(section)
  const subTitle = games.length > 0
    ? <React.Fragment>{games.map((g) => (
        <Badge style={{ fontSize: '0.8em' }} key={g.name} color={g.color} backgroundColor={g.backgroundColor}>
          {g.name}
        </Badge>
      ))}</React.Fragment>
    : undefined

  return (
    <Section title={section.title} subTitle={subTitle}>
      {boxes}
    </Section>
  )
}
