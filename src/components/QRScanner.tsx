"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner, Html5QrcodeResult } from "html5-qrcode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera, AlertTriangle, CheckCircle } from "lucide-react"
import { VisitorData } from "@/types"
import { toast } from "sonner"

interface QRScannerProps {
  onScanSuccess: (visitorData: VisitorData) => void
  onScanError?: (error: string) => void
  className?: string
}

export function QRScanner({ onScanSuccess, onScanError, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>("")
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const [scannerInitialized, setScannerInitialized] = useState(false)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const scannerElementId = "qr-scanner"

  useEffect(() => {
    // Clean up scanner on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }
    }
  }, [])

  const initializeScanner = async () => {
    try {
      setIsScanning(true)
      setError("")

      // Request camera permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop()) // Stop the test stream
        setPermissionGranted(true)
      } catch (permissionError) {
        setPermissionGranted(false)
        setError("Camera permission is required to scan QR codes. Please allow camera access and try again.")
        setIsScanning(false)
        return
      }

      // Scanner configuration
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: "environment" // Use back camera on mobile
        }
      }

      // Create scanner instance
      const scanner = new Html5QrcodeScanner(scannerElementId, config, false)
      scannerRef.current = scanner

      // Start scanning
      scanner.render(
        (decodedText: string, result: Html5QrcodeResult) => {
          handleScanSuccess(decodedText, result)
        },
        (errorMessage: string) => {
          // Ignore frequent scanning errors, only log them
          console.debug("QR scan attempt:", errorMessage)
        }
      )

      setScannerInitialized(true)
      toast.success("Camera initialized successfully!")
    } catch (err) {
      console.error("Scanner initialization error:", err)
      setError("Failed to initialize camera scanner. Please check your camera permissions and try again.")
      setIsScanning(false)
    }
  }

  const handleScanSuccess = (decodedText: string, result: Html5QrcodeResult) => {
    try {
      // Parse the QR code data
      const visitorData: VisitorData = JSON.parse(decodedText)
      
      // Validate that it's a valid visitor data object
      if (!visitorData.id || !visitorData.visitorName || !visitorData.hostEmail) {
        throw new Error("Invalid QR code format")
      }

      // Stop the scanner
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }

      toast.success("QR code scanned successfully!")
      onScanSuccess(visitorData)
    } catch (parseError) {
      console.error("QR code parsing error:", parseError)
      const errorMsg = "Invalid QR code. Please make sure you're scanning a valid visitor QR code."
      setError(errorMsg)
      toast.error(errorMsg)
      
      if (onScanError) {
        onScanError(errorMsg)
      }
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error)
      scannerRef.current = null
    }
    setIsScanning(false)
    setScannerInitialized(false)
  }

  const retryScanning = () => {
    setError("")
    setPermissionGranted(null)
    stopScanning()
    initializeScanner()
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission/Error Alerts */}
        {permissionGranted === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Camera permission denied. Please allow camera access in your browser settings and refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scanner Container */}
        <div className="flex flex-col items-center space-y-4">
          {!isScanning && !scannerInitialized && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Click the button below to start scanning QR codes
              </p>
              <Button onClick={initializeScanner} className="w-full">
                Start Camera Scanner
              </Button>
            </div>
          )}

          {isScanning && !scannerInitialized && (
            <div className="text-center space-y-4">
              <Skeleton className="mx-auto w-64 h-64 rounded-lg" />
              <p className="text-sm text-muted-foreground">
                Initializing camera...
              </p>
            </div>
          )}

          {/* Scanner element */}
          <div id={scannerElementId} className="w-full max-w-md mx-auto"></div>

          {/* Scanner Controls */}
          {scannerInitialized && (
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={stopScanning}
                className="flex-1"
              >
                Stop Scanner
              </Button>
              <Button 
                variant="outline" 
                onClick={retryScanning}
                className="flex-1"
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Position the visitor&apos;s QR code within the camera frame. The scanner will automatically detect and process the code.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
} 