import './Save.css'

import { Check, Clipboard, Copy, X } from 'lucide-react'
import { useState } from 'react'
import { storage } from '../lib/storage'
import Tooltip from './Tooltip'

interface SaveProps {
  onImport: (value: string) => boolean
}

export default function Save({ onImport }: SaveProps): React.ReactNode {
  const [isCopied, setIsCopied] = useState(false)
  const [isImported, setIsImported] = useState('')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storage.export())
      setIsCopied(true)
      // Reset the "copied" status after a few seconds
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const importValueFromClipboard = async () => {
    try {
      const value = await navigator.clipboard.readText()
      const result = onImport(value)
      setIsImported(result ? 'success' : 'failure')
      setTimeout(() => setIsImported(''), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className='save-container'>
      <Tooltip content="Copy the JSON data of your living dex.">
        <button className='save-button save-export' onClick={copyToClipboard}>
          <Copy size="1em" />Copy{isCopied ? <Check size="1em" /> : null}
        </button>
      </Tooltip>
      <Tooltip rightSide content="Replace the current living dex with the data on your clipboard.">
        <button className='save-button save-import' onClick={importValueFromClipboard}>
          <Clipboard size="1em" />Paste{isImported == 'success' ? <Check size="1em" /> : isImported == 'failure' ? <X size="1em" /> : null}
        </button>
      </Tooltip>
    </div>
  )
}
