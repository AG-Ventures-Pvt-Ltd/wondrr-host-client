'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/ui/card'
import { Button } from '@/common/ui/button'
import { Badge } from '@/common/ui/badge'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import BasicInfoStep from './steps/BasicInfoStep'
import LocationStep from './steps/LocationStep'
// import PricingDetailsStep from './steps/PricingDetailsStep'
import MediaAdditionalStep from './steps/MediaAdditionalStep'
import usePostData from '@/common/services/usePostData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Trip title and description' },
  { id: 2, title: 'Location', description: 'Where the trip takes place' },
  // { id: 3, title: 'Pricing & Details', description: 'Cost and inclusions' },
  { id: 3, title: 'Media & FAQ', description: 'Images and questions' },
]

const TripForm = ({ onCancel, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState([])
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    category: '',
    tags: [],
    
    // Location & Duration
    location: {
      address: '',
      city: '',
      state: '',
      latitude: null,
      longitude: null,
    },
    
    // Pricing & Details
    // basePrice: '',
    // inclusions: [],
    // exclusions: [],
    
    // Media & Additional
    tripImages: [],
    faqs: [],
    status: 'draft',
  })

  const createTripMutation = usePostData({
    url: API_ENDPOINTS.TRIPS.CREATE_HOST_TRIP,
    onSuccess: () => {
      onSuccess?.()
    },
  })

  const validateForm = () => {
    const errors = []

    // Basic Info Validation
    if (!formData.title.trim()) {
      errors.push('Trip title is required')
    }
    if (!formData.description.trim()) {
      errors.push('Trip description is required')
    }
    if (!formData.category.trim()) {
      errors.push('Trip category is required')
    }
    if (formData.tags.length < 7) {
      errors.push('At least 7 tags are required')
    }

    // Location Validation
    if (!formData.location.address.trim()) {
      errors.push('Address is required')
    }
    if (!formData.location.city.trim()) {
      errors.push('City is required')
    }
    if (!formData.location.state.trim()) {
      errors.push('State is required')
    }

    // Pricing & Details Validation
    // if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
    //   errors.push('Base price is required and must be greater than 0')
    // }
    // if (formData.inclusions.length < 5) {
    //   errors.push('At least 5 inclusions are required')
    // }
    // if (formData.exclusions.length < 5) {
    //   errors.push('At least 5 exclusions are required')
    // }

    // Media & FAQ Validation
    if (formData.tripImages.length < 5) {
      errors.push('At least 5 trip images are required')
    }
    if (formData.faqs.length < 4) {
      errors.push('At least 4 FAQs are required')
    }

    return errors
  }

  const updateFormData = (field, value) => {
    if (field === 'category') {
      value = value.toLowerCase()
    }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const updateNestedFormData = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))

    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    const errors = validateForm()
    setValidationErrors(errors)
    
    if (errors.length === 0) {
      // Extract only URLs from tripImages array
      const tripImageUrls = formData.tripImages.map(img => img.url)
      
      createTripMutation.mutate({ 
        ...formData, 
        tripImages: tripImageUrls,
        status: 'draft' 
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )
      case 2:
        return (
          <LocationStep
            formData={formData}
            updateNestedFormData={updateNestedFormData}
          />
        )
      case 3:
        return (
          <MediaAdditionalStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center gap-2">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep === step.id
                      ? 'border-primary bg-primary text-white'
                      : currentStep > step.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="hidden md:block flex-1">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Content */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <Badge variant="outline">Step {currentStep} of {STEPS.length}</Badge>
          </div>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="bg-white rounded-xl p-6 shadow-sm border sticky bottom-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            {currentStep === 1 && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} className="text-white">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={createTripMutation.isPending}
              >
                {createTripMutation.isPending ? 'Creating Trip...' : 'Create Trip'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripForm