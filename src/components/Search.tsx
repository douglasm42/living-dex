import './Search.css'

import React, { useEffect, useState } from 'react'
import Pokemon from './Pokemon'
import { findPokemon, setSearchIndex } from '../lib/pokemonSearch'
import { loadSearchIndex, type SearchEntry } from '../lib/DataLoader'
import { useHotkey } from '../lib/useHotkey'
import Modal from './Modal'

export default function Search() {
  const [visible, setVisible] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [results, setResults] = useState<SearchEntry[]>([])

  useEffect(() => {
    loadSearchIndex().then(setSearchIndex)
  }, [])

  useHotkey('p', () => {
    setVisible(!visible)
  }, { ctrl: true, preventDefault: true })

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.currentTarget.value
    setSearchInput(value)
    if (value.length > 3) {
      setResults(findPokemon(value))
    } else {
      setResults([])
    }
  }

  const onClose = () => {
    setVisible(false)
    setSearchInput('')
    setResults([])
  }

  if (!visible) {
    return <Modal visible={visible} onClose={onClose}></Modal>
  }

  return (
    <Modal visible={visible} onClose={onClose}>
      <input
        className="search-input"
        type="text"
        name="name"
        id="search-input"
        onChange={handleInput}
        value={searchInput}
        autoFocus={true}
      />
      <div className="results-container">
        {results.map((r) => (
          <Pokemon
            key={r.uuid}
            id={r.id.toString()}
            name={r.name}
            image={r.image}
            uuid={r.uuid}
            genLabel={`${r.section} - ${r.sub_section}`}
          />
        ))}
      </div>
    </Modal>
  )
}
