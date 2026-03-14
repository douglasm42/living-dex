import './Badge.css'

import React, { type PropsWithChildren } from 'react'

export interface BadgeProps extends PropsWithChildren {
  color?: string
  backgroundColor?: string
  style?: React.CSSProperties | undefined
}

export default function Badge({ color, backgroundColor, style, children }: BadgeProps): React.ReactNode  {
  return (
    <div className='badge' style={{...style, color, backgroundColor}}>{children}</div>
  )
}
