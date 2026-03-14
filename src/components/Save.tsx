import './Save.css'

import { Check, Clipboard, Copy, Loader, X } from 'lucide-react'
import { useState } from 'react'
import { storage } from '../lib/storage'
import Tooltip from './Tooltip'

interface SaveProps {
  onImport: (value: string) => boolean
}

export default function Save({ onImport }: SaveProps): React.ReactNode {
  const [busy, setBusy] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isImported, setIsImported] = useState('')

  const copyToClipboard = async () => {
    setBusy(true)
    try {
      await navigator.clipboard.writeText(storage.export())
      setBusy(false)
      setIsCopied(true)
      // Reset the "copied" status after a few seconds
      setTimeout(() => setIsCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const importValueFromClipboard = async () => {
    setBusy(true)
    try {
      const value = await navigator.clipboard.readText()
      const result = onImport(value)
      setBusy(false)
      setIsImported(result ? 'success' : 'failure')
      setTimeout(() => setIsImported(''), 3000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className='save-container'>
      <Tooltip content="Copy the JSON data of your living dex.">
        <button disabled={busy} className='save-button save-export' onClick={copyToClipboard}>
          <Copy size="1em" />Copy{isCopied && <Check size="1em" />}{busy && <Loader size="1em" />}
        </button>
      </Tooltip>
      <Tooltip rightSide content="Replace the current living dex with the data on your clipboard.">
        <button disabled={busy} className={`save-button save-import ${isImported}`} onClick={importValueFromClipboard}>
          <Clipboard size="1em" />Paste{isImported == 'success' ? <Check size="1em" /> : isImported == 'failure' ? <X size="1em" /> : null}{busy && <Loader size="1em" />}
        </button>
      </Tooltip>
    </div>
  )
}
