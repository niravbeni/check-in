"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { QRScanner } from "@/components/QRScanner"
import { VisitorData } from "@/types"
import { toast } from "sonner"


export default function CheckInPage() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null)
  const [identificationNotes, setIdentificationNotes] = useState("")
  const [locationNotes, setLocationNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [webhookError, setWebhookError] = useState<string>("")
  const router = useRouter()

  const handleScanSuccess = (scannedData: VisitorData) => {
    setVisitorData(scannedData)
    setWebhookError("")
    toast.success("✅ Visitor QR code scanned successfully!")
  }

  const handleScanError = (error: string) => {
    toast.error(`❌ ${error}`)
  }

  const handleCheckIn = async () => {
    if (!visitorData) return

    try {
      setIsSubmitting(true)
      setWebhookError("")
      
      // Get webhook URL from environment variable
      const webhookUrl = process.env.NEXT_PUBLIC_ZAPIER_CHECKIN_WEBHOOK_URL
      
      if (!webhookUrl) {
        throw new Error('Check-in webhook URL not configured')
      }

      // Create form data for Webhooks by Zapier
      const formData = new FormData()
      
      // Visitor information
      formData.append('visitorName', visitorData.visitorName)
      formData.append('visitorCompany', visitorData.visitorCompany)
      formData.append('visitorEmail', visitorData.visitorEmail)
      formData.append('purpose', visitorData.purpose)
      formData.append('hostEmail', visitorData.hostEmail)
      formData.append('visitorId', visitorData.id)
      
      // Check-in details
      formData.append('checkedInAt', new Date().toISOString())
      formData.append('checkedInTime', new Date().toLocaleString())
      formData.append('identificationNotes', identificationNotes || '')
      formData.append('locationNotes', locationNotes || '')
      
      // Additional metadata
      formData.append('action', 'visitor_checked_in')
      formData.append('timestamp', new Date().toISOString())

      // Send to Zapier webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`)
      }

      setIsComplete(true)
      toast.success("🎉 Check-in completed! Host notification sent via automation system.")
    } catch (error) {
      console.error('Check-in error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setWebhookError(errorMessage)
      toast.error(`❌ Failed to complete check-in: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewScan = () => {
    setVisitorData(null)
    setIdentificationNotes("")
    setLocationNotes("")
    setIsComplete(false)
    setWebhookError("")
  }

  const retryCheckIn = () => {
    handleCheckIn()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50 p-4">
      <div className="container mx-auto max-w-3xl">
        {/* Page Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-center bg-white rounded-full border border-gray-200 p-1 max-w-md mx-auto">
            <Button
              variant="ghost"
              className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-6 py-2"
              size="sm"
              onClick={() => router.push('/')}
            >
              Generate QR
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2"
              size="sm"
            >
              Scan QR
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Check-In</h1>
            <p className="text-muted-foreground text-lg">Scan visitor QR codes and complete check-in process</p>
          </div>
        </div>

        {/* Success State */}
        {isComplete ? (
          <div className="space-y-6">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Check-in Successful!</h2>
                  <p className="text-green-700">Host has been automatically notified via email</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Visitor Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Visitor</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-base py-1 px-3">
                        {visitorData?.visitorName}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Company</Label>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{visitorData?.visitorCompany}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Check-in Time</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Host Notified</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-700">
                        {visitorData?.hostEmail}
                      </span>
                    </div>
                  </div>
                </div>

                {(identificationNotes || locationNotes) && (
                                      <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
                      <h4 className="font-medium text-secondary-foreground mb-2">Check-in Notes</h4>
                    {identificationNotes && (
                                              <p className="text-sm text-secondary-foreground mb-1">
                          <strong>Identification:</strong> {identificationNotes}
                        </p>
                      )}
                      {locationNotes && (
                        <p className="text-sm text-secondary-foreground">
                          <strong>Location:</strong> {locationNotes}
                        </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={handleNewScan}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full px-8 py-3"
                size="lg"
              >
                Check In Another Visitor
              </Button>
            </div>
          </div>
        ) : visitorData ? (
          /* Show Check-in Form */
          <div className="space-y-6">
            {/* Visitor Info Card */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle>
                  Scanned Visitor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-base py-2 px-4">
                        {visitorData.visitorName}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">{visitorData.visitorCompany}</span>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                    <p className="text-muted-foreground bg-muted px-3 py-2 rounded-md">{visitorData.visitorEmail}</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Purpose of Visit</Label>
                                          <div className="bg-secondary border border-border p-4 rounded-lg">
                        <p className="text-secondary-foreground font-medium">{visitorData.purpose}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information (Optional)</CardTitle>
                <p className="text-sm text-muted-foreground">Add notes to help the host identify and locate the visitor</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identification" className="text-sm font-medium">
                    Identification Notes
                  </Label>
                  <Input
                    id="identification"
                    placeholder="e.g., Wearing a blue jacket and carrying a black backpack"
                    value={identificationNotes}
                    onChange={(e) => setIdentificationNotes(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location & Seating
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Seated in reception area near the front desk"
                    value={locationNotes}
                    onChange={(e) => setLocationNotes(e.target.value)}
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {webhookError && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm">
                  ❌ Failed to send check-in notification: {webhookError}
                  <div className="mt-2">
                    <Button
                      onClick={retryCheckIn}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 mr-2"
                      size="sm"
                    >
                      Retry
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Please try again or contact IT support
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleNewScan}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full px-6 py-3"
                disabled={isSubmitting}
                size="lg"
              >
                Scan Different Code
              </Button>
              <Button 
                onClick={handleCheckIn}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full px-6 py-3"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    Sending Notification...
                  </>
                ) : (
                  <>
                    Complete Check-In
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Show QR Scanner */
          <div className="space-y-6">
            {/* Scanner Card */}
            <Card className="border-2 border-dashed border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  QR Code Scanner
                </CardTitle>
                <p className="text-muted-foreground">
                  Position the visitor&apos;s QR code within the camera frame
                </p>
              </CardHeader>
              <CardContent>
                <QRScanner
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                />
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  )
} 