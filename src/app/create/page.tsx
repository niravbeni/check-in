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
import { QRGenerator } from "@/components/QRGenerator"
import { VisitorData } from "@/types"
import { toast } from "sonner"
import { ArrowLeft, QrCode } from "lucide-react"
import Link from "next/link"

const visitorFormSchema = z.object({
  visitorName: z.string().min(2, "Visitor name must be at least 2 characters"),
  visitorCompany: z.string().min(2, "Company name must be at least 2 characters"),
  visitorEmail: z.string().email("Please enter a valid visitor email address"),
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
  hostEmail: z.string().email("Please enter a valid host email address")
})

type VisitorFormValues = z.infer<typeof visitorFormSchema>

export default function CreateQRCodePage() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const form = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorFormSchema),
    defaultValues: {
      visitorName: "",
      visitorCompany: "",
      visitorEmail: "",
      purpose: "",
      hostEmail: ""
    }
  })

  const handleSubmit = async (values: VisitorFormValues) => {
    try {
      setIsGenerating(true)
      
      // Generate unique ID for the visitor
      const visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Create visitor data object
      const newVisitorData: VisitorData = {
        id: visitorId,
        visitorName: values.visitorName,
        visitorCompany: values.visitorCompany,
        visitorEmail: values.visitorEmail,
        purpose: values.purpose,
        hostEmail: values.hostEmail,
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
    form.reset()
  }

  const handleBackHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold">Create Visitor QR Code</h1>
          <p className="text-muted-foreground">Generate a QR code for a visitor that can be sent via email</p>
        </div>

        {/* Show QR Code if generated */}
        {visitorData ? (
          <div className="space-y-6">
            <QRGenerator visitorData={visitorData} />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handleStartOver}
                className="flex-1"
              >
                Create Another QR Code
              </Button>
              <Button 
                onClick={handleBackHome}
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </div>
        ) : (
          /* Show Form */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Visitor Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Visitor Details */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="visitorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visitor Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Miss Rita"
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
                      name="visitorCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Company X"
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
                      name="visitorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visitor Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="visitor@company.com"
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
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose of Visit *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Business meeting in Room Y"
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
                      name="hostEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email (Host) *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="host@company.com"
                              {...field}
                              disabled={isGenerating}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating QR Code...
                      </>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </>
                    )}
                  </Button>

                  {/* Help Text */}
                              <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Instructions:</p>
              <ul className="space-y-1 text-xs">
                <li>• Fill in all required fields marked with *</li>
                <li>• Your email will receive check-in notifications</li>
                <li>• QR code will be automatically sent to the visitor's email</li>
                <li>• The visitor should present this QR code upon arrival</li>
              </ul>
            </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 