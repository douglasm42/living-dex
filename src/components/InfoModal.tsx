import './InfoModal.css'

import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import Badge from './Badge'
import { getSpriteStyle, loadPokemonDetail, type PokemonDetail } from '../lib/DataLoader'
import { getWeaknesses, getResistances, getImmunities } from '../lib/typeEffectiveness'

const TYPE_COLORS: Record<string, { color: string, backgroundColor: string }> = {
  normal: { color: '#4c4f69', backgroundColor: 'color-mix(in srgb, #acb0be 30%, transparent)' },
  fire: { color: 'var(--cp-red)', backgroundColor: 'color-mix(in srgb, var(--cp-red) 20%, transparent)' },
  water: { color: 'var(--cp-blue)', backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)' },
  electric: { color: 'var(--cp-yellow)', backgroundColor: 'color-mix(in srgb, var(--cp-yellow) 20%, transparent)' },
  grass: { color: 'var(--cp-green)', backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)' },
  ice: { color: 'var(--cp-sky)', backgroundColor: 'color-mix(in srgb, var(--cp-sky) 20%, transparent)' },
  fighting: { color: 'var(--cp-peach)', backgroundColor: 'color-mix(in srgb, var(--cp-peach) 20%, transparent)' },
  poison: { color: 'var(--cp-lavender)', backgroundColor: 'color-mix(in srgb, var(--cp-lavender) 20%, transparent)' },
  ground: { color: '#df8e1d', backgroundColor: 'color-mix(in srgb, #df8e1d 20%, transparent)' },
  flying: { color: 'var(--cp-sky)', backgroundColor: 'color-mix(in srgb, var(--cp-sky) 20%, transparent)' },
  psychic: { color: 'var(--cp-mauve)', backgroundColor: 'color-mix(in srgb, var(--cp-mauve) 20%, transparent)' },
  bug: { color: 'var(--cp-green)', backgroundColor: 'color-mix(in srgb, var(--cp-green) 20%, transparent)' },
  rock: { color: 'var(--cp-peach)', backgroundColor: 'color-mix(in srgb, var(--cp-peach) 20%, transparent)' },
  ghost: { color: 'var(--cp-mauve)', backgroundColor: 'color-mix(in srgb, var(--cp-mauve) 20%, transparent)' },
  dragon: { color: 'var(--cp-blue)', backgroundColor: 'color-mix(in srgb, var(--cp-blue) 20%, transparent)' },
  dark: { color: '#4c4f69', backgroundColor: 'color-mix(in srgb, #4c4f69 20%, transparent)' },
  steel: { color: '#4c4f69', backgroundColor: 'color-mix(in srgb, #acb0be 20%, transparent)' },
  fairy: { color: 'var(--cp-pink)', backgroundColor: 'color-mix(in srgb, var(--cp-pink) 20%, transparent)' },
}

export interface InfoModalProps {
  uuid: string | undefined
  onClose: () => void
}

export default function InfoModal({ uuid, onClose }: InfoModalProps) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)

  useEffect(() => {
    if (!uuid) return
    loadPokemonDetail(uuid).then(setPokemon)
  }, [uuid])

  if (!uuid) {
    return <React.Fragment />
  }

  if (!pokemon) {
    return (
      <Modal visible onClose={onClose}>
        <div className="info-avatar info-loading" />
      </Modal>
    )
  }

  return (
    <Modal visible onClose={onClose}>
      <div className="info-avatar" style={getSpriteStyle(pokemon.image)}></div>
      <h1 className="info-title">{pokemon.name}</h1>
      <div className="info-types">
        {pokemon.types.map((type) => (
          <Badge
            key={type}
            color={TYPE_COLORS[type]?.color}
            backgroundColor={TYPE_COLORS[type]?.backgroundColor}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        ))}
      </div>
      <div className="info-effectiveness">
        {(() => {
          const weaknesses = getWeaknesses(pokemon.types)
          const resistances = getResistances(pokemon.types)
          const immunities = getImmunities(pokemon.types)
          return (
            <>
              {weaknesses.length > 0 && (
                <div className="effectiveness-section">
                  <h3>Weak to</h3>
                  <div className="effectiveness-types">
                    {weaknesses.map(({ type, multiplier }) => (
                      <Badge
                        key={type}
                        color={TYPE_COLORS[type]?.color}
                        backgroundColor={TYPE_COLORS[type]?.backgroundColor}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                        {multiplier === 4 && <span className="multiplier">×4</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {resistances.length > 0 && (
                <div className="effectiveness-section">
                  <h3>Resists</h3>
                  <div className="effectiveness-types">
                    {resistances.map(({ type, multiplier }) => (
                      <Badge
                        key={type}
                        color={TYPE_COLORS[type]?.color}
                        backgroundColor={TYPE_COLORS[type]?.backgroundColor}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                        {multiplier === 0.25 && <span className="multiplier">×¼</span>}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {immunities.length > 0 && (
                <div className="effectiveness-section">
                  <h3>Immune to</h3>
                  <div className="effectiveness-types">
                    {immunities.map(({ type }) => (
                      <Badge
                        key={type}
                        color={TYPE_COLORS[type]?.color}
                        backgroundColor={TYPE_COLORS[type]?.backgroundColor}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )
        })()}
      </div>
      {pokemon.evolutions.length > 0 && (
        <div className="info-evolutions">
          <h3>Evolutions</h3>
          <div className="evolution-list">
            {pokemon.evolutions.map((evo) => (
              <div key={evo.uuid} className="evolution-entry">
                <div className="evolution-sprite" style={getSpriteStyle(evo.image)}></div>
                <div className="evolution-name">{evo.name}</div>
                <div className="evolution-method">{evo.method}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ul>
        <li><a href={`https://pokemondb.net/pokedex/${pokemon.national_id}`} target="_blank" rel="noopener noreferrer">Open on PokemonDB</a></li>
        <li><a href={`https://bulbapedia.bulbagarden.net/wiki/${pokemon.name}`} target="_blank" rel="noopener noreferrer">Open on Bulbapedia</a></li>
      </ul>
    </Modal>
  )
}
