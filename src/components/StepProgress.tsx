import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  stepTitles?: string[]
  className?: string
}

export function StepProgress({ 
  currentStep, 
  totalSteps, 
  stepTitles = ["Create Invite", "Check In", "Confirmation"],
  className 
}: StepProgressProps) {
  const progressValue = (currentStep / totalSteps) * 100

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progressValue)}% Complete</span>
        </div>
        <Progress value={progressValue} className="w-full" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {stepTitles.slice(0, totalSteps).map((title, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center space-y-2">
              <Badge 
                variant={
                  isCompleted ? "default" : 
                  isCurrent ? "secondary" : 
                  "outline"
                }
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-secondary text-secondary-foreground ring-2 ring-primary",
                  isUpcoming && "bg-muted text-muted-foreground"
                )}
              >
                {stepNumber}
              </Badge>
              <span className={cn(
                "text-xs text-center max-w-20",
                isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
} 