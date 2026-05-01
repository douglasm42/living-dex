import './Pokemon.css'

import React, { useState } from 'react'
import { storage } from '../lib/storage'
import { getSpriteStyle, type SpriteCoords } from '../lib/DataLoader'
import InfoModal from './InfoModal'

export interface PokemonProps {
  id: string
  name: string
  image: SpriteCoords
  uuid: string
  subTitle?: string
  genLabel?: string
}

export default function Pokemon({ id, name, image, uuid, subTitle, genLabel }: PokemonProps): React.ReactNode {
  const [catched, setCatched] = useState(storage.catched(uuid))
  const [showInfo, setShowInfo] = useState(false)

  const handleCatch = () => {
    setCatched(!catched)
    storage.setCatched(uuid, !catched)
  }

  const handleInfoClick = (e: React.MouseEvent) => {
    setShowInfo(true)
    e.stopPropagation()
  }

  const onInfoClose = () => setShowInfo(false)

  const style = getSpriteStyle(image)

  const infoLink = <a className="pokemon-info" onClick={handleInfoClick}>i</a>

  const subTitleLabel = subTitle ? <React.Fragment><br />{subTitle}</React.Fragment> : undefined
  const generationLabel = genLabel ? <React.Fragment> - {genLabel}</React.Fragment> : undefined

  const infoModal = showInfo ? <InfoModal uuid={uuid} onClose={onInfoClose} /> : undefined

  return (
    <div className="box-cell">
      <div className='pokemon-container'>
        <div className={`pokemon-card ${catched ? 'pokemon-card-catched' : ''}`} onClick={handleCatch}>
          <div className={`pokemon-picture ${catched ? 'pokemon-picture-catched' : ''}`} style={style} />
          <div className="pokemon-id label">#{id}{generationLabel}</div>
          <div className="pokemon-name label">
            {name ? name : '---'}{subTitleLabel}
          </div>
          {infoLink}
        </div>
      </div>
      {infoModal}
    </div>
  )
}
