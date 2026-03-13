import './Tooltip.css'

import React, { useRef, useState } from 'react'

interface TooltipProps extends React.PropsWithChildren {
  content: React.ReactNode
  delay?: number
  rightSide?: boolean
}

export default function Tooltip({ content, children, delay = 1000, rightSide=false }: TooltipProps): React.ReactNode {
  const [isVisible, setIsVisible] = useState(false)

  const timeoutRef = useRef<number | undefined>(undefined)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  return (
    <div className='tooltip-container'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div className={`tooltip-card ${isVisible && 'visible'} ${rightSide && 'stick-to-right'}`}>{content}</div>
    </div>
  )
}
