import { useState } from 'react'
import { useTripFormStore } from '../store'

export const useTagManager = () => {
  const [tagInput, setTagInput] = useState('')
  const { addTag, removeTag, tags } = useTripFormStore()

  const handleAddTag = () => {
    if (tagInput.trim()) {
      // Split by comma and add multiple tags
      const tagArray = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      tagArray.forEach(tag => {
        addTag(tag)
      })
      setTagInput('')
      return true
    }
    return false
  }

  const handleRemoveTag = (tag: string) => {
    removeTag(tag)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (tagInput.trim()) {
        // Split by comma and add multiple tags
        const tagArray = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        tagArray.forEach(tag => {
          addTag(tag)
        })
        setTagInput('')
      }
    }
  }

  return {
    tagInput,
    setTagInput,
    tags,
    handleAddTag,
    handleRemoveTag,
    handleKeyPress,
  }
}
