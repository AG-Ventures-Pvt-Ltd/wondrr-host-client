import { useState } from 'react'
import { useTripFormStore } from '../store'

export const useInclusionManager = () => {
  const [inclusionInput, setInclusionInput] = useState('')
  const { inclusions, addInclusion, removeInclusion } = useTripFormStore()

  const handleAddInclusion = () => {
    if (inclusionInput.trim()) {
      addInclusion(inclusionInput)
      setInclusionInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddInclusion()
    }
  }

  return {
    inclusionInput,
    setInclusionInput,
    inclusions,
    handleAddInclusion,
    handleRemoveInclusion: removeInclusion,
    handleKeyPress,
  }
}
