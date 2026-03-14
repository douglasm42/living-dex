import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import './Pokemon.css'

import React, { useState } from 'react'
import { storage } from '../lib/storage'

export interface PokemonProps {
  id: string
  name: string
  imagePath: string
  uuid: string
  icon?: IconName
}

export default function Pokemon({ id, name, imagePath, uuid, icon }: PokemonProps): React.ReactNode {
  const [catched, setCatched] = useState(storage.catched(uuid))

  const handleCatch = () => {
    setCatched(!catched)
    storage.setCatched(uuid, !catched)
  }

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const style = {
    backgroundImage: uuid ? `url(https://raw.githubusercontent.com/PokeAPI/sprites/d8eba5657870d202c17905a3d9c412a758164b66/sprites/pokemon/other/home/${imagePath})` : undefined,
  }

  const infoLink = <a className="pokemon-info" onClick={handleChildClick} href={`https://pokemondb.net/pokedex/${id}`} target="_blank">i</a>
  const iconSpan = icon ? <DynamicIcon name={icon} size="1em" />: undefined

  return (
    <div className="box-cell">
      <div className='pokemon-container'>
        <div className={`pokemon-card ${catched ? 'pokemon-card-catched' : ''} pokemon-picture ${catched ? 'pokemon-picture-catched' : ''}`} style={style} onClick={handleCatch}>
          <div className="pokemon-id label">{iconSpan}#{id}</div>
          <div className="pokemon-name label">{name ? name : '---'}</div>
          {infoLink}
        </div>
      </div>
    </div>
  )
}
