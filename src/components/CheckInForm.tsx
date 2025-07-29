"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserCheck, Building, Clock, User, MapPin, IdCard } from "lucide-react"
import { VisitorData, CheckInData } from "@/types"
import { toast } from "sonner"

const checkInFormSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters"),
  identification: z.string().min(2, "Identification must be at least 2 characters"),
  checkedInBy: z.string().min(2, "Staff name must be at least 2 characters")
})

type CheckInFormValues = z.infer<typeof checkInFormSchema>

interface CheckInFormProps {
  visitorData: VisitorData
  onSubmit: (checkInData: CheckInData) => void
  isSubmitting?: boolean
  className?: string
}

export function CheckInForm({ visitorData, onSubmit, isSubmitting = false, className }: CheckInFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInFormSchema),
    defaultValues: {
      location: "",
      identification: "",
      checkedInBy: ""
    }
  })

  const handleSubmit = async (values: CheckInFormValues) => {
    try {
      setIsProcessing(true)
      
      // Create complete check-in data
      const checkInData: CheckInData = {
        ...visitorData,
        checkIn: {
          location: values.location,
          identification: values.identification,
          checkedInBy: values.checkedInBy,
          checkedInAt: new Date().toISOString()
        }
      }

      // Submit the check-in data
      onSubmit(checkInData)
      
      toast.success("Visitor checked in successfully!")
    } catch (error) {
      console.error("Check-in submission error:", error)
      toast.error("Failed to check in visitor. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={className}>
      {/* Visitor Information Display */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Visitor Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visitor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Visitor Name</span>
              </div>
              <Badge variant="secondary" className="text-base py-1 px-3">
                {visitorData.visitor.name}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>Company</span>
              </div>
              <Badge variant="outline" className="text-base py-1 px-3">
                {visitorData.visitor.company}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Meeting Room</span>
              </div>
              <Badge variant="outline" className="text-base py-1 px-3">
                {visitorData.visitor.meetingRoom}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                <span>Host</span>
              </div>
              <Badge variant="secondary" className="text-base py-1 px-3">
                {visitorData.host.name}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Purpose of Visit</span>
            </div>
            <p className="text-sm bg-muted p-3 rounded-lg">
              {visitorData.visitor.purpose}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Check-in Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Complete Check-In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Check-in Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Main Lobby, 15th Floor Reception"
                        {...field}
                        disabled={isSubmitting || isProcessing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identification Field */}
              <FormField
                control={form.control}
                name="identification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      Identification Verified
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Driver's License, Passport, Company ID"
                        {...field}
                        disabled={isSubmitting || isProcessing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Staff Name Field */}
              <FormField
                control={form.control}
                name="checkedInBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Staff Member Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        disabled={isSubmitting || isProcessing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Instructions */}
              <Alert>
                <AlertDescription className="text-sm">
                  Please verify the visitor&apos;s identity and record the check-in location. 
                  The host will be automatically notified once check-in is complete.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting || isProcessing}
              >
                {isSubmitting || isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Check-In...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Complete Check-In
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 