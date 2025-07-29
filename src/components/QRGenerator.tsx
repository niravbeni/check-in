"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Download, QrCode, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { VisitorData } from "@/types"
import { toast } from "sonner"

interface QRGeneratorProps {
  visitorData: VisitorData
  className?: string
}

export function QRGenerator({ visitorData, className }: QRGeneratorProps) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    generateQRCode()
  }, [visitorData.id]) // Generate QR when visitor data changes

  const generateQRCode = async () => {
    try {
      setIsGenerating(true)
      setError("")
      
      // Create QR code data with visitor information
      const qrData = JSON.stringify(visitorData)
      
      // Generate QR code with high error correction and good size
      const dataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQRCodeDataURL(dataURL)
      
      // Only send email once per visitor (using visitor data as unique key)
      const visitorKey = `${visitorData.visitorEmail}_${visitorData.id}`
      const sentEmails = JSON.parse(sessionStorage.getItem('sentQREmails') || '[]')
      
      if (!sentEmails.includes(visitorKey)) {
        sentEmails.push(visitorKey)
        sessionStorage.setItem('sentQREmails', JSON.stringify(sentEmails))
        await sendQRCodeEmail(dataURL)
      } else {
        // Email already sent for this visitor
        setEmailSent(true)
        toast.success(`QR code was already sent to ${visitorData.visitorEmail}`)
      }
      
    } catch (err) {
      console.error('QR Code generation error:', err)
      setError('Failed to generate QR code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const sendQRCodeEmail = async (qrCodeDataUrl: string) => {
    try {
      setIsSendingEmail(true)
      setEmailError("")
      
      const response = await fetch('/api/send-qr-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorData,
          qrCodeDataUrl
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      setEmailSent(true)
      
      if (result.duplicate) {
        toast.success(`QR code was already sent to ${visitorData.visitorEmail}`)
      } else {
        toast.success(`QR code sent successfully to ${visitorData.visitorEmail}!`)
      }
      
    } catch (err) {
      console.error('Email sending error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email'
      setEmailError(errorMessage)
      toast.error(`Failed to send email to ${visitorData.visitorEmail}. You can still download/copy the QR code.`)
    } finally {
      setIsSendingEmail(false)
    }
  }

  const copyQRCode = async () => {
    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      toast.success("QR code copied to clipboard!")
    } catch (err) {
      console.error('Copy failed:', err)
      toast.error("Failed to copy QR code. Try the download option.")
    }
  }

  const downloadQRCode = () => {
    try {
      const link = document.createElement('a')
      link.download = `visitor-qr-${visitorData.visitorName.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = qrCodeDataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("QR code downloaded successfully!")
    } catch (err) {
      console.error('Download failed:', err)
      toast.error("Failed to download QR code.")
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Visitor QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex justify-center">
          {isGenerating ? (
            <Skeleton className="h-[300px] w-[300px] rounded-lg" />
          ) : (
            <div className="border-2 border-muted rounded-lg p-4 bg-white">
              <img 
                src={qrCodeDataURL} 
                alt="Visitor QR Code"
                className="w-full h-auto max-w-[300px]"
              />
            </div>
          )}
        </div>

        {/* Visitor Information Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Visitor Details:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{visitorData.visitorName}</Badge>
            <Badge variant="outline">{visitorData.visitorCompany}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{visitorData.visitorEmail}</Badge>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm"><strong>Purpose:</strong> {visitorData.purpose}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {!isGenerating && qrCodeDataURL && (
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={copyQRCode}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadQRCode}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        )}

        {/* Email Status */}
        {isSendingEmail && (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Sending QR code to <strong>{visitorData.visitorEmail}</strong>...
            </AlertDescription>
          </Alert>
        )}
        
        {emailSent && !isSendingEmail && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              ✅ QR code successfully sent to <strong>{visitorData.visitorEmail}</strong>! 
              The visitor should present it upon arrival for check-in.
            </AlertDescription>
          </Alert>
        )}
        
        {emailError && !isSendingEmail && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              ❌ Failed to send email to <strong>{visitorData.visitorEmail}</strong>: {emailError}
              <br />
              <span className="mt-1 block">You can manually send the QR code using the copy/download buttons above.</span>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 