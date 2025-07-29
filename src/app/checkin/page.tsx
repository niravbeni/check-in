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
import { ArrowLeft, CheckCircle, User, Building, Clock, Webhook, Scan, UserCheck, AlertTriangle } from "lucide-react"
import Link from "next/link"

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

      // Prepare check-in data for Zapier webhook
      const checkInData = {
        // Visitor information
        visitorName: visitorData.visitorName,
        visitorCompany: visitorData.visitorCompany,
        visitorEmail: visitorData.visitorEmail,
        purpose: visitorData.purpose,
        hostEmail: visitorData.hostEmail,
        visitorId: visitorData.id,
        
        // Check-in details
        checkedInAt: new Date().toISOString(),
        checkedInTime: new Date().toLocaleString(),
        identificationNotes: identificationNotes || null,
        locationNotes: locationNotes || null,
        
        // Additional metadata
        action: 'visitor_checked_in',
        timestamp: new Date().toISOString()
      }

      // Send to Zapier webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInData)
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

  const handleBackHome = () => {
    router.push("/")
  }

  const retryCheckIn = () => {
    handleCheckIn()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <Scan className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Check-In</h1>
            <p className="text-muted-foreground text-lg">Scan QR code to check in visitors and notify hosts</p>
          </div>
        </div>

        {/* Success State */}
        {isComplete ? (
          <div className="space-y-6">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Check-in Successful!</h2>
                  <p className="text-green-700">Host has been automatically notified via email</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
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
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{visitorData?.visitorCompany}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Check-in Time</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Host Notified</Label>
                    <div className="flex items-center gap-2">
                      <Webhook className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {visitorData?.hostEmail}
                      </span>
                    </div>
                  </div>
                </div>

                {(identificationNotes || locationNotes) && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Check-in Notes</h4>
                    {identificationNotes && (
                      <p className="text-sm text-blue-800 mb-1">
                        <strong>Identification:</strong> {identificationNotes}
                      </p>
                    )}
                    {locationNotes && (
                      <p className="text-sm text-blue-800">
                        <strong>Location:</strong> {locationNotes}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handleNewScan}
                className="flex-1"
                size="lg"
              >
                <Scan className="h-4 w-4 mr-2" />
                Check In Another Visitor
              </Button>
              <Button 
                onClick={handleBackHome}
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        ) : visitorData ? (
          /* Show Check-in Form */
          <div className="space-y-6">
            {/* Visitor Info Card */}
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
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
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-lg">{visitorData.visitorCompany}</span>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                    <p className="text-muted-foreground bg-muted px-3 py-2 rounded-md">{visitorData.visitorEmail}</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">Purpose of Visit</Label>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-blue-900 font-medium">{visitorData.purpose}</p>
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
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  ❌ Failed to send check-in notification: {webhookError}
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={retryCheckIn}
                      className="mr-2"
                    >
                      <Webhook className="h-3 w-3 mr-1" />
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
                variant="outline" 
                onClick={handleNewScan}
                className="flex-1"
                disabled={isSubmitting}
                size="lg"
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan Different Code
              </Button>
              <Button 
                onClick={handleCheckIn}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Notification...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
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
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <Scan className="h-6 w-6 text-blue-600" />
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
            
            {/* Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <Scan className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900">How to Check In</h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>1. Ask the visitor to show their QR code</p>
                    <p>2. Position the QR code within the camera frame above</p>
                    <p>3. Add optional identification notes if needed</p>
                    <p>4. Complete check-in to automatically notify the host</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 