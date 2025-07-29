"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QRScanner } from "@/components/QRScanner"
import { VisitorData, CheckInNotificationData } from "@/types"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle, User, Building, Clock, Mail } from "lucide-react"
import Link from "next/link"

export default function CheckInPage() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null)
  const [identificationNotes, setIdentificationNotes] = useState("")
  const [locationNotes, setLocationNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const handleScanSuccess = (scannedData: VisitorData) => {
    setVisitorData(scannedData)
    toast.success("Visitor QR code scanned successfully!")
  }

  const handleScanError = (error: string) => {
    toast.error(error)
  }

  const handleCheckIn = async () => {
    if (!visitorData) return

    try {
      setIsSubmitting(true)
      
      // Prepare notification data
      const notificationData: CheckInNotificationData = {
        hostEmail: visitorData.hostEmail,
        visitorName: visitorData.visitorName,
        visitorCompany: visitorData.visitorCompany,
        purpose: visitorData.purpose,
        checkedInAt: new Date().toISOString(),
        identificationNotes: identificationNotes || undefined,
        locationNotes: locationNotes || undefined
      }

      // Send confirmation email
      const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send confirmation email')
      }

      const result = await response.json()
      console.log('Email sent successfully:', result)

      setIsComplete(true)
      toast.success("Check-in completed! Host has been notified.")
    } catch (error) {
      console.error('Check-in error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to complete check-in: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewScan = () => {
    setVisitorData(null)
    setIdentificationNotes("")
    setLocationNotes("")
    setIsComplete(false)
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
          <h1 className="text-2xl font-bold">Scan Visitor QR Code</h1>
          <p className="text-muted-foreground">Scan a visitor's QR code to automatically check them in</p>
        </div>

        {/* Success State */}
        {isComplete ? (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Check-in completed successfully!</strong> The host has been notified via email.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">✅ Visitor Checked In</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{visitorData?.visitorName}</span>
                    <span className="text-muted-foreground">from</span>
                    <span className="font-medium">{visitorData?.visitorCompany}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Confirmation sent to {visitorData?.hostEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Checked in at {new Date().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handleNewScan}
                className="flex-1"
              >
                Scan Another Visitor
              </Button>
              <Button 
                onClick={handleBackHome}
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </div>
        ) : visitorData ? (
          /* Show Check-in Form */
          <div className="space-y-6">
            {/* Visitor Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Visitor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    <p className="font-medium">{visitorData.visitorName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Company</Label>
                    <p className="font-medium">{visitorData.visitorCompany}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-medium">{visitorData.visitorEmail}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-muted-foreground">Purpose</Label>
                    <p className="text-sm bg-muted p-3 rounded-lg">{visitorData.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Check-in Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="identification">Identification Notes</Label>
                  <Input
                    id="identification"
                    placeholder="e.g., Green jumper and gold glasses"
                    value={identificationNotes}
                    onChange={(e) => setIdentificationNotes(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location/Seating Notes</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Seated in Room Y, Reception area"
                    value={locationNotes}
                    onChange={(e) => setLocationNotes(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Check-in Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handleNewScan}
                className="flex-1"
                disabled={isSubmitting}
              >
                Scan Different Code
              </Button>
              <Button 
                onClick={handleCheckIn}
                className="flex-1"
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
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
            />
            
            <Alert>
              <AlertDescription className="text-sm">
                Position the visitor&apos;s QR code within the camera frame. 
                After scanning, you can add optional notes before completing the check-in.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  )
} 