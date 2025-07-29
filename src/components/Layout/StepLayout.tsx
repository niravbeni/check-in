import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepProgress } from "@/components/StepProgress"
import { cn } from "@/lib/utils"

interface StepLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps?: number
  title: string
  description?: string
  className?: string
}

export function StepLayout({
  children,
  currentStep,
  totalSteps = 3,
  title,
  description,
  className
}: StepLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-background to-muted/50 p-4", className)}>
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Visitor Check-In System
          </h1>
          <p className="text-muted-foreground">
            Professional QR code-based visitor management
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Main Content Card */}
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Secure • Professional • Efficient</p>
        </div>
      </div>
    </div>
  )
} 