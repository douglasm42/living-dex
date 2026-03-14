import './Save.css'

import { Check, Clipboard, Copy, Eraser, Loader, X } from 'lucide-react'
import { useState } from 'react'
import { storage } from '../lib/storage'

interface SaveProps {
  onImport: (value: string) => boolean
  onClear: () => boolean
}

export default function Save({ onImport, onClear }: SaveProps): React.ReactNode {
  const [busy, setBusy] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isImported, setIsImported] = useState('')
  const [isCleared, setIsCleared] = useState(false)

  const copyToClipboard = async () => {
    setBusy(true)
    try {
      await navigator.clipboard.writeText(storage.export())
      setBusy(false)
      setIsCopied(true)
      // Reset the "copied" status after a few seconds
      setTimeout(() => setIsCopied(false), 1000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const importValueFromClipboard = async () => {
    const confirmed = confirm('If you continue you will replace your current dex data with the one in your clipboard. Are you sure?')
    if(!confirmed) {
      return
    }
    setBusy(true)
    try {
      const value = await navigator.clipboard.readText()
      const result = onImport(value)
      setBusy(false)
      setIsImported(result ? 'success' : 'failure')
      setTimeout(() => setIsImported(''), result ? 1000 : 3000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const clearCurrentDexData = async () => {
    const confirmed = confirm('If you continue you will erase your current Dex data. Are you sure?')
    if(!confirmed) {
      return
    }
    setBusy(true)
    try {
      onClear()
      setBusy(false)
      setIsCleared(true)
      setTimeout(() => setIsCleared(false), 1000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className='save-container'>
      <button disabled={busy} className='save-button save-export' onClick={copyToClipboard}>
        <Copy size="1em" />Copy{isCopied && <Check size="1em" />}
      </button>
      <button disabled={busy} className={`save-button save-import ${isImported}`} onClick={importValueFromClipboard}>
        <Clipboard size="1em" />Paste{isImported == 'success' ? <Check size="1em" /> : isImported == 'failure' ? <X size="1em" /> : null}{busy && <Loader size="1em" />}
      </button>
      <button disabled={busy} className='save-button save-export' onClick={clearCurrentDexData}>
        <Eraser size="1em" />Clear{isCleared && <Check size="1em" />}
      </button>
    </div>
  )
}
