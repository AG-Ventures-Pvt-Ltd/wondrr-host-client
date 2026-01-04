import React from 'react'
import { Check } from 'lucide-react'
import { Step } from '../types'

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-64 shrink-0">
      <div className="sticky top-8">
        <h1 className="text-2xl font-medium text-maintext mb-2">Create Account</h1>
        <p className="text-sm text-subtext mb-8">Join us and start your journey</p>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                    currentStep > step.id
                      ? 'bg-primary text-white'
                      : currentStep === step.id
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-2 transition-all ${
                      currentStep > step.id ? 'bg-primary' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-medium transition-colors ${
                    currentStep >= step.id ? 'text-maintext' : 'text-neutral-400'
                  }`}
                >
                  {step.name}
                </h3>
                <p className="text-xs text-subtext mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepIndicator