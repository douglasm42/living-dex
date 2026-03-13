const ITEM_ID = 'catchedPokemons'

export class PokemonsStatus {
  pokemons: Record<string, boolean>

  constructor() {
    this.pokemons = {}

    const storedValue = window.localStorage.getItem(ITEM_ID)
    if (storedValue) {
      try {
        this.pokemons = JSON.parse(storedValue)
      } catch (error) {
        console.error(error)
        window.localStorage.removeItem(ITEM_ID)
      }
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

  import(value: string) {
    const imported = JSON.parse(value)

    console.log(Object.keys(imported).some(v => typeof v !== 'string'))

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
  }
}

export const storage = new PokemonsStatus()
