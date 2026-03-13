import { Info } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { storage } from '../lib/storage'
import './Pokemon.css'

import React, { useState } from 'react'

export interface PokemonProps {
  id: string,
  name: string,
  imagePath: string,
  uuid: string,
  icon?: IconName,
}

export default function Pokemon({ id, name, imagePath, uuid, icon }: PokemonProps): React.ReactNode {
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

  const infoLink = <a className="pokemon-info" onClick={handleChildClick} href={`https://pokemondb.net/pokedex/${id}`} target="_blank"><Info /></a>
  const iconSpan = icon ? <span className="pokemon-icon"><DynamicIcon name={icon} size="1em" /></span> : undefined

  return (
    <div className="box-cell pokemon-container">
      <div className={`pokemon-card ${catched ? 'pokemon-card-catched' : ''}`} onClick={handleCatch}>
        <div className="pokemon-name">#{id}</div>
        <div className={`pokemon-picture ${catched ? 'pokemon-picture-catched' : ''}`} style={style} />
        <div className="pokemon-name">{name ? name : '---'}</div>
        {infoLink}
        {iconSpan}
      </div>
    </div>
  )
}
