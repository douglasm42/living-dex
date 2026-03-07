import './Pokemon.css'

import React from 'react'

export default function EmptyCell(): React.ReactNode {
  return (
    <div className="box-cell pokemon-container">
      <div className="pokemon-card pokemon-card-empty" >
        <div className="pokemon-name">#???</div>
        <div className="pokemon-picture" />
        <div className="pokemon-name">???</div>
      </div>
    </div>
  )
}
