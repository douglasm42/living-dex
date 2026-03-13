import { storage } from '../lib/storage'
import './Pokemon.css'

import React, { useState } from 'react'

export interface PokemonProps {
  id: string,
  name: string,
  imagePath: string,
  uuid: string
}

export default function Pokemon({ id, name, imagePath, uuid }: PokemonProps): React.ReactNode {
  const [catched, setStatus] = useState(storage.catched(uuid))

  React.useEffect(() => {
    storage.setCatched(uuid, catched)
  }, [uuid, catched])

  const handleCatch = () => {
    setStatus(!catched)
  }

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const style = {
    backgroundImage: uuid ? `url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${imagePath})` : undefined,
  }

  const nameLink = name ? <a className="pokemon-name-link" onClick={handleChildClick} href={`https://pokemondb.net/pokedex/${id}`} target="_blank">{name}</a> : '---'

  return (
    <div className="box-cell pokemon-container">
      <div className={`pokemon-card ${catched ? 'pokemon-card-catched' : ''}`} onClick={handleCatch}>
        <div className="pokemon-name">#{id}</div>
        <div className={`pokemon-picture ${catched ? 'pokemon-picture-catched' : ''}`} style={style} />
        <div className="pokemon-name">{nameLink}</div>
      </div>
    </div>
  )
}
