"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Step {
  id: number
  title: string
  description: string
  component: React.ReactNode
}

interface RegistrationWizardProps {
  steps: Step[]
  onComplete: () => void
}

export function RegistrationWizard({ steps, onComplete }: RegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const isStepCompleted = (stepIndex: number) => completedSteps.includes(stepIndex)
  const canProceed = isStepCompleted(currentStep)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const markStepCompleted = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Registration Process</h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : isStepCompleted(index)
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isStepCompleted(index) ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${isStepCompleted(index) ? "bg-green-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>{steps[currentStep].component}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button onClick={nextStep} disabled={!canProceed}>
          {currentStep === steps.length - 1 ? "Complete" : "Next"}
          {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
