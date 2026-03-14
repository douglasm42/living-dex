import { deflate, inflate } from 'pako'

const ITEM_ID = 'catchedPokemons'

function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0) as number)
}

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

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
    if(catched) {
      this.pokemons[id] = catched
    } else {
      delete this.pokemons[id]
    }
    window.localStorage.setItem(ITEM_ID, JSON.stringify(this.pokemons))
  }

  removeUnused() {
    Object.entries(this.pokemons).forEach( ([uuid, catched]) => {
      if(!catched) {
        delete this.pokemons[uuid]
      }
    })
    window.localStorage.setItem(ITEM_ID, JSON.stringify(this.pokemons))
  }

  export(): string {
    this.removeUnused()
    return bytesToBase64(deflate(JSON.stringify(this.pokemons)))
  }

  import(value: string) {
    try {
      const bytes = base64ToBytes(value)
      const inflated = inflate(bytes, { to: 'string' })
  
      if(this.isValid(inflated)) {
        this.load(inflated)
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error(err)
      return false
    }
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
