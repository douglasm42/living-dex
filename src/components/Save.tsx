import { Check } from 'lucide-react'
import { useState } from 'react'
import { storage } from '../lib/storage'

interface SaveProps {
  onImport: (value: string) => void
}

export default function Save({ onImport }: SaveProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isImported, setIsImported] = useState(false)

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
      onImport(value)
      setIsImported(true)
      setTimeout(() => setIsImported(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div>
      <button onClick={copyToClipboard}>Export{isCopied ? <Check size="1em" /> : null}</button>
      <button onClick={importValueFromClipboard}>Import{isImported ? <Check size="1em" /> : null}</button>
    </div>
  )
}
