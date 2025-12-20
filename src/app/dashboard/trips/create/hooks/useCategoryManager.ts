import { useState, useRef, useEffect } from 'react'
import { useTripFormStore } from '../store'
import { TRIP_CATEGORIES } from '../constants'

export const useCategoryManager = () => {
  const { category, updateField } = useTripFormStore()
  const [customCategory, setCustomCategory] = useState('')
  const initializedRef = useRef(false)

  // Initialize custom category if category is not in predefined list
  useEffect(() => {
    if (!initializedRef.current && category) {
      const normalizedCategory = category.toLowerCase()
      const isPredefined = TRIP_CATEGORIES.some(cat => cat.toLowerCase() === normalizedCategory)
      if (!isPredefined && category !== 'Other') {
        // Use a timeout to avoid synchronous setState in effect
        setTimeout(() => {
          setCustomCategory(category)
          updateField('category', 'Other')
        }, 0)
      }
      initializedRef.current = true
    }
  }, [category, updateField])

  const handleCategoryChange = (value: string) => {
    updateField('category', value)
    if (value !== 'Other') {
      setCustomCategory('')
    }
  }

  const handleCustomCategoryChange = (value: string) => {
    setCustomCategory(value)
    updateField('category', value.trim() || 'Other')
  }

  return {
    category,
    customCategory,
    handleCategoryChange,
    handleCustomCategoryChange,
  }
}
