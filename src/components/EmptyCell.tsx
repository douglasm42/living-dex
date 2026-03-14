import './Pokemon.css'

import React from 'react'

export default function EmptyCell(): React.ReactNode {
  return (
    <div className="box-cell">
      <div className="pokemon-container">
        <div className="pokemon-card pokemon-card-empty" >
        </div>
      </div>
    </div>
  )
}
