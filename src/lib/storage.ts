const ITEM_ID = 'catchedPokemons'

export class PokemonsStatus {
  pokemons: Record<string, boolean>

  constructor() {
    this.pokemons = {}

    const storedValue = window.localStorage.getItem(ITEM_ID)
    if (storedValue) {
      this.load(storedValue)
    }
  }

  catched(id: string): boolean {
    return this.pokemons[id] || false
  }

  setCatched(id: string, catched: boolean) {
    this.pokemons[id] = catched
    window.localStorage.setItem(ITEM_ID, JSON.stringify(this.pokemons))
  }

  export(): string {
    return JSON.stringify(this.pokemons)
  }

  isValid(value: string): boolean {
    try {
      const imported = JSON.parse(value)

      if(typeof imported !== 'object') {
        return false
      }
      if(Object.keys(imported).some(v => typeof v !== 'string')) {
        return false
      }
      if(Object.values(imported).some(v => typeof v !== 'boolean')) {
        return false
      }

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  load(value: string) {
    try {
      const imported = JSON.parse(value)

      if(typeof imported !== 'object') {
        throw new Error('invalid imported string! it needs to be a valid JSON object!')
      }
      if(Object.keys(imported).some(v => typeof v !== 'string')) {
        throw new Error('invalid imported string! it needs to be a valid JSON object containing only string keys!')
      }
      if(Object.values(imported).some(v => typeof v !== 'boolean')) {
        throw new Error('invalid imported string! it needs to be a valid JSON object containing only boolean values!')
      }

      this.pokemons = imported
      window.localStorage.setItem(ITEM_ID, value)
    } catch (error) {
      console.error(error)
      this.pokemons = {}
      window.localStorage.removeItem(ITEM_ID)
    }
  }
}

export const storage = new PokemonsStatus()
