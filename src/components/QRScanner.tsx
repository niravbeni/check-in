"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerElementId = "qr-scanner"

  useEffect(() => {
    // Clean up scanner on unmount
    return () => {
      const cleanup = async () => {
        try {
          if (scannerRef.current && scannerRef.current.getState() === 2) {
            // State 2 means scanning is active
            await scannerRef.current.stop()
          }
        } catch (error) {
          console.debug("Cleanup error (scanner likely already stopped):", error)
        }
      }
      cleanup()
    }
  }, [])

  

  const initializeScanner = async () => {
    try {
      setIsScanning(true)
      setError("")

      // Request camera permission first
      try {
        // Try to get available cameras
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        
        if (videoDevices.length === 0) {
          throw new Error('No cameras found')
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "user", // Try front camera first for laptops
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        stream.getTracks().forEach(track => track.stop()) // Stop the test stream
        setPermissionGranted(true)
      } catch (permissionError) {
        console.error("Camera permission error:", permissionError)
        setPermissionGranted(false)
        setError("Camera permission is required to scan QR codes. Please allow camera access and try again.")
        setIsScanning(false)
        return
      }

      // Create scanner instance (camera-only, no file upload UI)
      const scanner = new Html5Qrcode(scannerElementId)
      scannerRef.current = scanner

      // Configuration for camera scanning
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      }

      try {
        // Start camera scanning
        await scanner.start(
          { facingMode: "user" }, // Camera constraints
          config,
          (decodedText: string, result: Html5QrcodeResult) => {
            handleScanSuccess(decodedText, result)
          },
          (errorMessage: string) => {
            // Ignore frequent scanning errors, only log them
            console.debug("QR scan attempt:", errorMessage)
          }
        )
        
        setScannerInitialized(true)
        setIsScanning(false) // Camera is now running, but not in "loading" state
        toast.success("Camera ready")
      } catch (startError) {
        console.error("Failed to start camera:", startError)
        setError("Failed to start camera. Please check permissions and try again.")
        setIsScanning(false)
        setScannerInitialized(false)
        return
      }
    } catch (err) {
      console.error("Scanner initialization error:", err)
      setError("Failed to initialize camera scanner. Please check your camera permissions and try again.")
      setIsScanning(false)
    }
  }

  const handleScanSuccess = async (decodedText: string, _result: Html5QrcodeResult) => {
    try {
      // Parse the QR code data
      const visitorData: VisitorData = JSON.parse(decodedText)
      
      // Validate that it's a valid visitor data object
      if (!visitorData.id || !visitorData.visitorName || !visitorData.hostEmail) {
        throw new Error("Invalid QR code format")
      }

      // Stop the scanner after successful scan
      try {
        if (scannerRef.current && scannerRef.current.getState() === 2) {
          await scannerRef.current.stop()
          setScannerInitialized(false)
          setIsScanning(false)
        }
      } catch (stopError) {
        console.debug("Scanner stop error (likely already stopped):", stopError)
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



  return (
    <div className={className}>
      {/* Error Messages */}
      {permissionGranted === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Camera permission denied. Please allow camera access and refresh the page.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Scanner Area */}
      <div className="space-y-4">
        {!isScanning && !scannerInitialized && (
          <div className="text-center space-y-4">
            <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Ready to scan QR code</p>
            </div>
            <Button 
              onClick={initializeScanner} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
              size="lg"
            >
              Start Camera
            </Button>
          </div>
        )}

        {isScanning && !scannerInitialized && (
          <div className="text-center space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <p className="text-sm text-gray-500">Starting camera...</p>
          </div>
        )}

        {/* Scanner element */}
        <div 
          id={scannerElementId} 
          className="w-full [&_video]:transform [&_video]:scale-x-[-1] [&_video]:rounded-lg"
        ></div>
      </div>
    </div>
  )
} 