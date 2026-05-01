import fuzzy from 'fuzzy'
import type { SearchEntry } from './DataLoader'

let searchIndex: SearchEntry[] = []

export function setSearchIndex(index: SearchEntry[]) {
  searchIndex = index
}

export function findPokemon(pattern: string): SearchEntry[] {
  return fuzzy
    .filter(pattern, searchIndex, { extract: (entry) => entry.name })
    .map((r) => r.original)
}
