"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Scan } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            QR Code Visitor System
          </h1>
          <p className="text-muted-foreground">
            Create QR codes for visitors or scan them for check-in
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create QR Code */}
          <Link href="/create">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <QrCode className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Create QR Code</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Generate a QR code for a visitor with their details. Send this to the visitor via email.
                </p>
                <Button className="w-full" size="lg">
                  Create Visitor QR Code
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Scan QR Code */}
          <Link href="/checkin">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Scan className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Scan a visitor's QR code to check them in. An automatic confirmation email will be sent to the host.
                </p>
                <Button className="w-full" size="lg" variant="secondary">
                  Start QR Scanner
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
