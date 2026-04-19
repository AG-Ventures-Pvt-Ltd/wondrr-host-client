import { useState } from 'react'
import { useTripFormStore } from '../store'

const stripBulletPrefix = (text: string): string =>
  text.trim().replace(/^[-*•·●▪▸>]\s+/, '').replace(/^\d+[.):]\s+/, '')

export const useInclusionManager = () => {
  const [inclusionInput, setInclusionInput] = useState('')
  const { inclusions, addInclusion, removeInclusion } = useTripFormStore()

  const handleAddInclusion = () => {
    const lines = inclusionInput.split('\n').map(stripBulletPrefix).filter(Boolean)
    lines.forEach((line) => addInclusion(line))
    setInclusionInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddInclusion()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text')
    const lines = pasted.split('\n').map(stripBulletPrefix).filter(Boolean)
    if (lines.length > 1) {
      e.preventDefault()
      lines.forEach((line) => addInclusion(line))
    }
  }

  return {
    inclusionInput,
    setInclusionInput,
    inclusions,
    handleAddInclusion,
    handleRemoveInclusion: removeInclusion,
    handleKeyPress,
    handlePaste,
  }
}
