import { useState } from 'react'
import { useTripFormStore } from '../store'

export const useExclusionManager = () => {
  const [exclusionInput, setExclusionInput] = useState('')
  const { exclusions, addExclusion, removeExclusion } = useTripFormStore()

  const handleAddExclusion = () => {
    if (exclusionInput.trim()) {
      addExclusion(exclusionInput)
      setExclusionInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddExclusion()
    }
  }

  return {
    exclusionInput,
    setExclusionInput,
    exclusions,
    handleAddExclusion,
    handleRemoveExclusion: removeExclusion,
    handleKeyPress,
  }
}
