import { useHotkey } from '../lib/useHotkey'
import './Modal.css'

import React from 'react'

export interface ModalProps extends React.PropsWithChildren {
  visible: boolean
  onClose: () => void
}

export default function Modal({ visible, onClose, children }: ModalProps) {
  useHotkey('Escape', onClose, { ctrl: false, preventDefault: false, ignoreOnInput: false } )

  const preventClose: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  }

  return (
    <div className={`modal-background ${visible ? 'visible' : ''}`} onClick={onClose}>
      <div className='modal-container'>
        <div className="modal-box" onClick={preventClose}>
          {children}
        </div>
      </div>
    </div>
  )
}
