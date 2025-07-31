"use client"

import { useEffect, useState, useCallback } from "react"
import QRCode from "qrcode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Download, QrCode, Webhook, CheckCircle, AlertCircle } from "lucide-react"
import { VisitorData } from "@/types"
import { toast } from "sonner"
import Image from "next/image"

interface QRGeneratorProps {
  visitorData: VisitorData
  className?: string
}

export function QRGenerator({ visitorData, className }: QRGeneratorProps) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [isSendingToZapier, setIsSendingToZapier] = useState(false)
  const [zapierSent, setZapierSent] = useState(false)
  const [zapierError, setZapierError] = useState<string>("")
  const [error, setError] = useState<string>("")

  const sendToZapierWebhook = useCallback(async (qrCodeDataUrl: string) => {
    try {
      setIsSendingToZapier(true)
      setZapierError("")
      
      // Get webhook URL from environment variable
      const webhookUrl = process.env.NEXT_PUBLIC_ZAPIER_QR_WEBHOOK_URL
      
      if (!webhookUrl) {
        throw new Error('Zapier webhook URL not configured')
      }

      // Create form data for Webhooks by Zapier
      const formData = new FormData()
      
      // Visitor information
          formData.append('visitorName', visitorData.visitorName)
    formData.append('visitorCompany', visitorData.visitorCompany)
    formData.append('visitorEmail', visitorData.visitorEmail)
    formData.append('purpose', visitorData.purpose)
    formData.append('hostName', visitorData.hostName)
    formData.append('hostEmail', visitorData.hostEmail)
    formData.append('meetingDate', visitorData.meetingDate)
    formData.append('meetingTime', visitorData.meetingTime)
    formData.append('createdAt', visitorData.createdAt)
    formData.append('visitorId', visitorData.id)
      
      // QR Code data
      formData.append('qrCodeDataUrl', qrCodeDataUrl)
      formData.append('qrCodeData', JSON.stringify(visitorData))
      
      // Convert base64 to file for email attachment
      const imageResponse = await fetch(qrCodeDataUrl)
      const blob = await imageResponse.blob()
      const fileName = `visitor-qr-${visitorData.id}.png`
      
      // Try multiple formats for Zapier compatibility
      formData.append('qrCodeFile', blob, fileName)
      
      // Also send as base64 without data URL prefix for Zapier
      const base64Only = qrCodeDataUrl.split(',')[1]
      formData.append('qrCodeBase64', base64Only)
      formData.append('qrCodeFilename', fileName)
      formData.append('qrCodeMimeType', 'image/png')
      

      
      // Additional metadata
      formData.append('timestamp', new Date().toISOString())
      formData.append('action', 'qr_code_generated')

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`)
      }

      setZapierSent(true)
      toast.success(`✅ Visitor data sent to automation system! Email will be sent to ${visitorData.visitorEmail}`)
      
    } catch (err) {
      console.error('Zapier webhook error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to send to automation system'
      setZapierError(errorMessage)
      toast.error(`Failed to send to automation system. You can still use the QR code manually.`)
    } finally {
      setIsSendingToZapier(false)
    }
  }, [visitorData])

  const generateQRCode = useCallback(async () => {
    try {
      setIsGenerating(true)
      setError("")
      
      // Create compact QR code data with essential information only
      const compactData = {
        id: visitorData.id,
        n: visitorData.visitorName,
        c: visitorData.visitorCompany, 
        e: visitorData.visitorEmail,
        p: visitorData.purpose,
        hn: visitorData.hostName,
        he: visitorData.hostEmail,
        md: visitorData.meetingDate,
        mt: visitorData.meetingTime
      }
      const qrData = JSON.stringify(compactData)
      
      // Generate QR code with minimal error correction for cleanest appearance
      const dataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'L',
        type: 'image/png',
        margin: 2,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQRCodeDataURL(dataURL)
      
      // Send to Zapier webhook (only once per visitor)
      const visitorKey = `${visitorData.visitorEmail}_${visitorData.id}`
      const sentWebhooks = JSON.parse(sessionStorage.getItem('sentZapierQR') || '[]')
      
      if (!sentWebhooks.includes(visitorKey)) {
        sentWebhooks.push(visitorKey)
        sessionStorage.setItem('sentZapierQR', JSON.stringify(sentWebhooks))
        await sendToZapierWebhook(dataURL)
      } else {
        // Already sent to Zapier for this visitor
        setZapierSent(true)
        toast.success(`Visitor data already processed for ${visitorData.visitorName}`)
      }
      
    } catch (err) {
      console.error('QR Code generation error:', err)
      setError('Failed to generate QR code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [visitorData, sendToZapierWebhook])

  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

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

  const retrySendToZapier = () => {
    if (qrCodeDataURL) {
      sendToZapierWebhook(qrCodeDataURL)
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
              <Image
                src={qrCodeDataURL}
                alt="Visitor QR Code"
                width={300}
                height={300}
                className="w-full h-auto max-w-[300px]"
                unoptimized={true}
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
            <p className="text-sm mt-1"><strong>Host:</strong> {visitorData.hostName} ({visitorData.hostEmail})</p>
            <p className="text-sm mt-1"><strong>Meeting:</strong> {new Date(visitorData.meetingDate).toLocaleDateString()} at {visitorData.meetingTime}</p>
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

        {/* Zapier Webhook Status */}
        {isSendingToZapier && (
          <Alert>
            <Webhook className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Sending visitor data to automation system...
            </AlertDescription>
          </Alert>
        )}
        
        {zapierSent && !isSendingToZapier && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              ✅ Visitor data sent to automation system! An email with the QR code will be automatically sent to <strong>{visitorData.visitorEmail}</strong>.
            </AlertDescription>
          </Alert>
        )}
        
        {zapierError && !isSendingToZapier && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              ❌ Failed to send to automation system: {zapierError}
              <br />
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retrySendToZapier}
                  className="flex items-center gap-2"
                >
                  <Webhook className="h-3 w-3" />
                  Retry
                </Button>
                <span className="text-xs text-muted-foreground self-center">
                  You can still use the QR code manually
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
} 