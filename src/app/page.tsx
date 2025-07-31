"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { QRGenerator } from "@/components/QRGenerator"
import { VisitorData } from "@/types"
import { toast } from "sonner"


const visitorFormSchema = z.object({
  visitorName: z.string().min(2, "Visitor name must be at least 2 characters"),
  visitorCompany: z.string().min(2, "Company name must be at least 2 characters"),
  visitorEmail: z.string().email("Please enter a valid visitor email address"),
  purpose: z.string().min(4, "Purpose must be at least 5 characters"),
  hostName: z.string().min(2, "Host name must be at least 2 characters"),
  hostEmail: z.string().email("Please enter a valid host email address")
})

type VisitorFormValues = z.infer<typeof visitorFormSchema>

export default function HomePage() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [meetingDateTime, setMeetingDateTime] = useState<Date | undefined>()
  const router = useRouter()

  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorFormSchema),
    defaultValues: {
      visitorName: "",
      visitorCompany: "",
      visitorEmail: "",
      purpose: "",
      hostName: "",
      hostEmail: ""
    }
  })

  const handleSubmit = async (values: VisitorFormValues) => {
    try {
      setIsGenerating(true)
      
      // Validate meeting date and time
      if (!meetingDateTime) {
        toast.error("Please select a meeting date and time")
        return
      }
      
      // Generate unique ID for the visitor
      const visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Create visitor data object
      const newVisitorData: VisitorData = {
        id: visitorId,
        visitorName: values.visitorName,
        visitorCompany: values.visitorCompany,
        visitorEmail: values.visitorEmail,
        purpose: values.purpose,
        hostName: values.hostName,
        hostEmail: values.hostEmail,
        meetingDate: meetingDateTime.toISOString(),
        meetingTime: meetingDateTime.toTimeString().slice(0, 5), // Format as HH:MM
        createdAt: new Date().toISOString()
      }

      // Set the visitor data to trigger QR code generation
      setVisitorData(newVisitorData)
      
      toast.success("QR code generated successfully!")
    } catch (error) {
      console.error("Error creating QR code:", error)
      toast.error("Failed to generate QR code. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartOver = () => {
    setVisitorData(null)
    setMeetingDateTime(undefined)
    form.reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50 p-4">
      <div className="container mx-auto max-w-3xl">
        {/* Page Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-center bg-white rounded-full border border-gray-200 p-1 max-w-md mx-auto">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2"
              size="sm"
            >
              Generate QR
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-6 py-2"
              size="sm"
              onClick={() => router.push('/scan')}
            >
              Scan QR
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create QR Code</h1>
            <p className="text-muted-foreground text-lg">Generate visitor QR codes with automated email delivery</p>
          </div>
        </div>

        {/* Show QR Code if generated */}
        {visitorData ? (
          <div className="space-y-6">
            <QRGenerator visitorData={visitorData} />
            
            <div className="flex justify-center">
              <Button 
                onClick={handleStartOver}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full px-8 py-3"
                size="lg"
              >
                Create Another QR Code
              </Button>
            </div>
          </div>
        ) : (
          /* Show Form */
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle>
                Visitor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Visitor Details */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="visitorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Visitor Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nirav Beni"
                              {...field}
                              disabled={isGenerating}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visitorCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Company *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="IDEO"
                              {...field}
                              disabled={isGenerating}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visitorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Visitor Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="nbeni@ideo.com"
                              {...field}
                              disabled={isGenerating}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Purpose of Visit *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Reason for visit"
                              className="resize-none"
                              rows={3}
                              {...field}
                              disabled={isGenerating}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hostName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Your Name (Host) *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Jane Smith"
                              {...field}
                              disabled={isGenerating}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hostEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Your Email (Host) *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="host@company.com"
                              {...field}
                              disabled={isGenerating}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Meeting Date and Time */}
                    <DateTimePicker
                      date={meetingDateTime}
                      onDateTimeChange={setMeetingDateTime}
                      disabled={isGenerating}
                    />
                                    </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                    size="lg"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        Generating QR Code...
                      </>
                    ) : (
                      <>
                        Generate QR Code
                      </>
                    )}
                  </Button>


                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 