import { type PokemonData } from '../lib/PokemonData';
import './Search.css'

import React, { useState } from 'react'
import Pokemon, { type PokemonProps } from './Pokemon';
import { findPokemon } from '../lib/pokemonSearch';
import { useHotkey } from '../lib/useHotkey';
import Modal from './Modal';

function buildPokemonForSearch(p: PokemonData): PokemonProps {
  return {
    id: p.id.toString(),
    name: [p.prefix, p.title, p.variation == 'f' ? p.subTitle : null].filter(n => n).join(' '),
    imagePath: p.imagePath,
    uuid: p.uuid,
    subTitle: p.variation == 'f' ? undefined : (p.subTitle || undefined),
    icon: p.variation?.split('-').includes('f') ? 'venus' : undefined,
    showGen: true,
  }
}

export default function Search() {
  const [ visible, setVisible ] = useState(false)
  const [ searchInput, setSearchInput ] = useState('')

  useHotkey('p', () => {
    setVisible(!visible)
  }, { ctrl: true, preventDefault: true })

  const handleInput: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (event) => {
    setSearchInput(event.currentTarget.value)
  }

  const onClose = () => {
    setVisible(false)
    setSearchInput('')
  }

  if(visible) {
    let results: PokemonData[] = []
    if(searchInput.length > 3) {
      results = findPokemon(searchInput)
    }

    const renderedResults = results.map( r => {
      return (
        <Pokemon {...buildPokemonForSearch(r)} />
      )
    })

    return (
      <Modal visible={visible} onClose={onClose}>
        <input className='search-input' type='text' name='name' id='search-input' onChange={handleInput} value={searchInput} autoFocus={true} />
        <div className="results-container">
          {renderedResults}
        </div>
      </Modal>
    )

  } else {
    return <Modal visible={visible} onClose={onClose}></Modal>
  }

}
