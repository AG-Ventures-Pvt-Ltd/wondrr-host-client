import { useState } from 'react'
import { useTripFormStore } from '../store'

const stripBulletPrefix = (text: string): string =>
  text.trim().replace(/^[-*•·●▪▸>]\s+/, '').replace(/^\d+[.):]\s+/, '')

export const useThingsToCarryManager = () => {
  const [thingToCarryInput, setThingToCarryInput] = useState('')
  const { thingsToCarry, addThingToCarry, removeThingToCarry } = useTripFormStore()

  const handleAddThingToCarry = () => {
    const lines = thingToCarryInput.split('\n').map(stripBulletPrefix).filter(Boolean)
    lines.forEach((line) => addThingToCarry(line))
    setThingToCarryInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddThingToCarry()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text')
    const lines = pasted.split('\n').map(stripBulletPrefix).filter(Boolean)
    if (lines.length > 1) {
      e.preventDefault()
      lines.forEach((line) => addThingToCarry(line))
    }
  }

  return {
    thingToCarryInput,
    setThingToCarryInput,
    thingsToCarry,
    handleAddThingToCarry,
    handleRemoveThingToCarry: removeThingToCarry,
    handleKeyPress,
    handlePaste,
  }
}
