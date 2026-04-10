import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import './Pokemon.css'

import React, { useState } from 'react'
import { storage } from '../lib/storage'
import { ATLAS_SPRITE_MAP, getGeneration } from '../lib/PokemonData'

export interface PokemonProps {
  id: string
  name: string
  imagePath: string
  uuid: string
  icon?: IconName
  subTitle?: string
  showGen?: boolean
}

export default function Pokemon({ id, name, imagePath, uuid, icon, subTitle, showGen }: PokemonProps): React.ReactNode {
  const [catched, setCatched] = useState(storage.catched(uuid))

  const handleCatch = () => {
    setCatched(!catched)
    storage.setCatched(uuid, !catched)
  }

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const spriteInfo = imagePath in ATLAS_SPRITE_MAP ? ATLAS_SPRITE_MAP[imagePath] : undefined

  const spriteStepX = (10 / (100.0 - 10) * 100.0)
  const spriteStepY = (10 / (150.0 - 10) * 100.0)

  const style = uuid && spriteInfo ? {
    backgroundImage: `url(./atlas_${spriteInfo.sheet}.png)`,
    backgroundPositionX: `${spriteInfo.x * spriteStepX}%`,
    backgroundPositionY: `${spriteInfo.y * spriteStepY}%`,
    backgroundSize: `1000% 1500%`,
  } : undefined

  const infoLink = <a className="pokemon-info" onClick={handleChildClick} href={`https://pokemondb.net/pokedex/${id}`} target="_blank">i</a>
  const iconSpan = icon ? <DynamicIcon name={icon} size="1em" />: undefined

  const subTitleLabel = subTitle ? <React.Fragment><br />{subTitle}</React.Fragment> : undefined
  const generation = showGen ? <React.Fragment> - {getGeneration(uuid)?.smallTitle}</React.Fragment> : undefined

  return (
    <div className="box-cell">
      <div className='pokemon-container'>
        <div className={`pokemon-card ${catched ? 'pokemon-card-catched' : ''}`} onClick={handleCatch}>
          <div className={`pokemon-picture ${catched ? 'pokemon-picture-catched' : ''}`} style={style} />
          <div className="pokemon-id label">{iconSpan}#{id}{generation}</div>
          <div className="pokemon-name label">
            {name ? name : '---'}{subTitleLabel}
          </div>
          {infoLink}
        </div>
      </div>
    </div>
  )
}
