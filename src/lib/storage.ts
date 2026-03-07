interface PokemonStatus {
  id: string
  catched: boolean
}

export class PokemonsStatus {
  pokemons: Record<string, PokemonStatus>

  constructor() {
    this.pokemons = {}

    const storedValue = window.localStorage.getItem('pokemons')
    if (storedValue) {
      try {
        this.pokemons = JSON.parse(storedValue)
      } catch (error) {
        console.error(error)
        window.localStorage.removeItem('pokemons')
      }
    }
  }

  catched(id: string): boolean {
    return this.pokemons[id]?.catched || false
  }

  setCatched(id: string, catched: boolean) {
    this.pokemons[id] = {
      id,
      catched,
    }
    window.localStorage.setItem('pokemons', JSON.stringify(this.pokemons))
  }
}

export const storage = new PokemonsStatus()
