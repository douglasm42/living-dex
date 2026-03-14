import './Section.css'

import React, { type PropsWithChildren } from 'react'

interface SectionProps extends PropsWithChildren {
  title: React.ReactNode
  subTitle?: React.ReactNode
}

export default function Section({ title, subTitle, children }: SectionProps): React.ReactNode {
  return (
    <section className='section-container'>
      <h2 className='section-title'>{title}</h2>
      { subTitle && <h3 className='section-sub-title'>{subTitle}</h3> }
      <hr className='divider' />
      <div className='section-box-container'>
        {children}
      </div>
    </section>
  )
}
