"use client"

import Link from "next/link"
import { StepLayout } from "@/components/Layout/StepLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Users, QrCode, Home } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <StepLayout
      currentStep={3}
      title="System Ready"
      description="Your visitor check-in system is now active and ready to use"
    >
      <div className="space-y-6">
        {/* Success Alert */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>System Setup Complete!</strong> Your visitor check-in system is ready for use.
          </AlertDescription>
        </Alert>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/create" className="block">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <QrCode className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">Create Visitor Invite</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate a QR code for an expected visitor
                  </p>
                </div>
              </Link>

              <Link href="/checkin" className="block">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium">Check In Visitor</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan a visitor&apos;s QR code to complete check-in
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">For Hosts:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Create visitor invitations</li>
                  <li>• Generate secure QR codes</li>
                  <li>• Receive email notifications</li>
                  <li>• Track visitor arrivals</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">For Guest Services:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Scan QR codes with camera</li>
                  <li>• Verify visitor identity</li>
                  <li>• Complete check-in process</li>
                  <li>• Send automatic notifications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/create" className="flex-1">
            <Button className="w-full">
              <QrCode className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
          <p className="font-medium mb-2">Need Help?</p>
          <p>
            This system requires camera permissions for QR code scanning and proper email configuration for notifications.
          </p>
          <p className="mt-2">
            For setup instructions, please refer to the project documentation.
          </p>
        </div>
      </div>
    </StepLayout>
  )
} 