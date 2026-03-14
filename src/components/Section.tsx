import { SquareMinus, SquarePlus } from 'lucide-react'
import './Section.css'

import React, { useState, type PropsWithChildren } from 'react'

interface SectionProps extends PropsWithChildren {
  title: React.ReactNode
  subTitle?: React.ReactNode
  startOpen?: boolean
}

export default function Section({ title, subTitle, children, startOpen }: SectionProps): React.ReactNode {
  const [isOpen, setIsOpen] = useState(startOpen)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <section className='section-container'>
      <button 
        className="section-container-collapsible-toggle" 
        onClick={togglePanel}
        aria-expanded={isOpen} // Accessibility best practice
      >
        <h2 className='section-title'>
          {isOpen ? <SquareMinus className='section-title-toggle' size="0.8em" /> : <SquarePlus className='section-title-toggle' size="0.8em" />}
          {title}
        </h2>
        { subTitle && <h3 className='section-sub-title'>{subTitle}</h3> }
        <hr className='divider' />
      </button>
      <div className={`section-collapsible-container ${isOpen ? 'open' : 'closed'}`}>
        <div className={`section-box-container `}>
          {children}
        </div>
      </div>
    </section>
  )
}
