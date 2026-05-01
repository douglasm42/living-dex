import { parse as yamlParse } from 'yaml'

export interface SpriteCoords {
  sheet: number
  x: number
  y: number
}

export interface PokemonEntry {
  id: number
  uuid: string
  name: string
  types: string[]
  image: SpriteCoords
}

export interface EvolutionEntry {
  uuid: string
  name: string
  id: number
  image: SpriteCoords
  method: string
}

export interface PokemonDetail {
  uuid: string
  national_id: number
  name: string
  types: string[]
  image: SpriteCoords
  evolutions: EvolutionEntry[]
}

export interface SubSection {
  title: string
  pokemons: PokemonEntry[]
}

export interface SectionData {
  title: string
  tags: string[]
  sub_sections: SubSection[]
}

export interface SearchEntry {
  name: string
  uuid: string
  id: number
  types: string[]
  image: SpriteCoords
  section: string
  sub_section: string
}

const BASE = import.meta.env.BASE_URL

let sectionsCache: SectionData[] | null = null
let searchIndexCache: SearchEntry[] | null = null
const pokemonDetailCache = new Map<string, PokemonDetail>()

async function fetchYaml<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}${path}`)
  if (!response.ok) throw new Error(`Failed to fetch ${path}`)
  const text = await response.text()
  return yamlParse(text) as T
}

const SECTION_FILES = [
  'generation-1', 'generation-2', 'generation-3',
  'generation-4', 'generation-5', 'generation-6',
  'generation-7', 'generation-8', 'generation-9',
  'extra-credits',
]

export async function loadSections(): Promise<SectionData[]> {
  if (sectionsCache) return sectionsCache

  const sections = await Promise.all(
    SECTION_FILES.map((f) => fetchYaml<SectionData>(`data/sections/${f}.yaml`))
  )

  sectionsCache = sections
  return sections
}

export async function loadPokemonDetail(uuid: string): Promise<PokemonDetail | null> {
  if (pokemonDetailCache.has(uuid)) {
    return pokemonDetailCache.get(uuid)!
  }

  try {
    const detail = await fetchYaml<PokemonDetail>(`data/pokemons/${uuid}.yaml`)
    pokemonDetailCache.set(uuid, detail)
    return detail
  } catch {
    return null
  }
}

export async function loadSearchIndex(): Promise<SearchEntry[]> {
  if (searchIndexCache) return searchIndexCache

  const index = await fetchYaml<SearchEntry[]>('data/index.yaml')
  searchIndexCache = index
  return index
}

export function getSpriteStyle(coords: SpriteCoords): React.CSSProperties {
  const spriteStepX = (10 / (100.0 - 10) * 100.0)
  const spriteStepY = (10 / (150.0 - 10) * 100.0)

  return {
    backgroundImage: `url(${BASE}atlas_${coords.sheet}.png)`,
    backgroundPositionX: `${coords.x * spriteStepX}%`,
    backgroundPositionY: `${coords.y * spriteStepY}%`,
    backgroundSize: '1000% 1500%',
  }
}
