import { useState } from 'react'
import { useTripFormStore } from '../store'

export const useFAQManager = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const { addFAQ, removeFAQ, faqs } = useTripFormStore()

  const handleAddFAQ = () => {
    if (question.trim() && answer.trim()) {
      addFAQ(question, answer)
      setQuestion('')
      setAnswer('')
      return true
    }
    return false
  }

  const handleRemoveFAQ = (id: number) => {
    removeFAQ(id)
  }

  const resetFAQForm = () => {
    setQuestion('')
    setAnswer('')
  }

  const isValid = question.trim() !== '' && answer.trim() !== ''

  return {
    question,
    setQuestion,
    answer,
    setAnswer,
    faqs,
    handleAddFAQ,
    handleRemoveFAQ,
    resetFAQForm,
    isValid,
  }
}
