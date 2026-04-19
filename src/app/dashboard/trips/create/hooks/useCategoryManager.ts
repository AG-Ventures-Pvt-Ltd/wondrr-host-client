import { useTripFormStore } from '../store'

export const useCategoryManager = () => {
  const { category, toggleCategory } = useTripFormStore()

  return {
    selectedCategories: category,
    toggleCategory,
  }
}
