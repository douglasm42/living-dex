import './InfoModal.css'

import React from 'react'
import Modal from './Modal'
import { ATLAS_SPRITE_MAP, genericPokemonTitle, POKEMON_UUID_MAP } from '../lib/PokemonData'

export interface InfoModalProps {
  uuid: string | undefined
  onClose: () => void
}

function imageStyle(imagePath: string) {
  const spriteInfo = imagePath in ATLAS_SPRITE_MAP ? ATLAS_SPRITE_MAP[imagePath] : undefined

  const spriteStepX = (10 / (100.0 - 10) * 100.0)
  const spriteStepY = (10 / (150.0 - 10) * 100.0)

  return spriteInfo ? {
    backgroundImage: `url(./atlas_${spriteInfo.sheet}.png)`,
    backgroundPositionX: `${spriteInfo.x * spriteStepX}%`,
    backgroundPositionY: `${spriteInfo.y * spriteStepY}%`,
    backgroundSize: `1000% 1500%`,
  } : undefined
}

export default function InfoModal({ uuid, onClose }: InfoModalProps) {
  if(uuid !== undefined && uuid in POKEMON_UUID_MAP) {
    const pokemon = POKEMON_UUID_MAP[uuid]

    return (
      <Modal visible onClose={onClose} >
        <div className='info-avatar'  style={imageStyle(pokemon.imagePath)}></div>
        <h1 className='info-title'>{genericPokemonTitle(pokemon)}</h1>
        <ul>
          <li><a href={`https://pokemondb.net/pokedex/${pokemon.id}`} target="_blank">Open on PokemonDB</a></li>
          <li><a href={`https://bulbapedia.bulbagarden.net/wiki/${pokemon.title}`} target="_blank">Open on Bulbapedia</a></li>
        </ul>
        
        
      </Modal>
    )
  } else {
    return <React.Fragment />
  }
}
