import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { VisitorData } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'

// Simple in-memory cache to prevent duplicate emails (resets on server restart)
const sentEmailsCache = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visitorData, qrCodeDataUrl } = body as {
      visitorData: VisitorData
      qrCodeDataUrl: string
    }

    if (!visitorData || !qrCodeDataUrl) {
      return NextResponse.json(
        { error: 'Visitor data and QR code are required' },
        { status: 400 }
      )
    }

    if (!qrCodeDataUrl.startsWith('data:image/png;base64,')) {
      return NextResponse.json(
        { error: 'Invalid QR code format' },
        { status: 400 }
      )
    }

    // Create unique key for this visitor to prevent duplicates
    const visitorKey = `${visitorData.visitorEmail}_${visitorData.id}`
    const now = Date.now()
    const lastSent = sentEmailsCache.get(visitorKey)
    
    // If email was sent in the last 60 seconds, consider it a duplicate
    if (lastSent && (now - lastSent) < 60000) {
      console.log(`🚫 Duplicate email blocked for ${visitorData.visitorEmail} (sent ${Math.round((now - lastSent) / 1000)}s ago)`)
      return NextResponse.json({ 
        success: true, 
        message: 'Email already sent recently',
        duplicate: true
      })
    }

    // Record this email attempt
    sentEmailsCache.set(visitorKey, now)

    const emailSubject = `Your Visitor QR Code - ${visitorData.purpose}`
    
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Visitor QR Code</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px; }
          .qr-container { text-align: center; margin: 30px 0; padding: 30px; background: #f8f9fa; border-radius: 10px; border: 2px dashed #dee2e6; }
          .qr-code { max-width: 250px; height: auto; margin: 20px 0; }
          .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #495057; }
          .value { color: #6c757d; }
          .instructions { background: #e7f3ff; border-left: 4px solid #007bff; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e5e9; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin:0; font-size: 28px;">🎫 Your Visitor QR Code</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Ready for your visit</p>
        </div>
        
        <div class="content">
          <p>Hello <strong>${visitorData.visitorName}</strong>,</p>
          
          <p>Your visitor QR code has been generated and is ready for your upcoming visit. Please save this email and present the QR code below when you arrive.</p>
          
          <div class="qr-container">
            <h3 style="margin-top: 0; color: #495057;">📱 Your QR Code</h3>
            <img src="${qrCodeDataUrl}" alt="Visitor QR Code" class="qr-code" style="max-width: 250px; height: auto; display: block; margin: 20px auto;" />
            <p style="color: #6c757d; font-size: 14px; margin-bottom: 0;">Show this QR code to guest services upon arrival</p>
          </div>
          
          <div class="details">
            <h4 style="margin-top: 0; color: #495057;">📋 Visit Details</h4>
            <div class="detail-row">
              <span class="label">Visitor Name:</span>
              <span class="value">${visitorData.visitorName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Company:</span>
              <span class="value">${visitorData.visitorCompany}</span>
            </div>
            <div class="detail-row">
              <span class="label">Purpose:</span>
              <span class="value">${visitorData.purpose}</span>
            </div>
            <div class="detail-row">
              <span class="label">Host Contact:</span>
              <span class="value">${visitorData.hostEmail}</span>
            </div>
          </div>
          
          <div class="instructions">
            <h4 style="margin-top: 0; color: #007bff;">📍 Check-in Instructions</h4>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Save this email or take a screenshot of the QR code</li>
              <li>Arrive at the designated location</li>
              <li>Present your QR code to guest services</li>
              <li>Wait for confirmation - your host will be automatically notified</li>
            </ol>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
            <strong>Note:</strong> This QR code contains your visit information and should not be shared with others.
          </p>
        </div>
        
        <div class="footer">
          <p>QR Code Visitor System • Secure • Professional • Efficient</p>
          <p style="font-size: 12px; margin-top: 10px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
    `

    const emailText = `
Your Visitor QR Code

Hello ${visitorData.visitorName},

Your visitor QR code has been generated for your upcoming visit.

Visit Details:
- Visitor Name: ${visitorData.visitorName}
- Company: ${visitorData.visitorCompany}
- Purpose: ${visitorData.purpose}
- Host Contact: ${visitorData.hostEmail}

Check-in Instructions:
1. Save this email or take a screenshot of the QR code
2. Arrive at the designated location
3. Present your QR code to guest services
4. Wait for confirmation - your host will be automatically notified

Note: This QR code contains your visit information and should not be shared with others.

---
QR Code Visitor System • Secure • Professional • Efficient
This is an automated message. Please do not reply to this email.
    `

    console.log('🚀 Attempting to send email to:', visitorData.visitorEmail)
    console.log('📧 From email:', fromEmail)
    console.log('🔑 API Key exists:', !!process.env.RESEND_API_KEY)
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: visitorData.visitorEmail,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
      attachments: [
        {
          filename: 'visitor-qr-code.png',
          content: qrCodeDataUrl.split(',')[1], // Remove data:image/png;base64, prefix
        },
      ],
    })

    console.log('✅ Resend API Response:', JSON.stringify(result, null, 2))

    return NextResponse.json({ 
      success: true, 
      messageId: result.data?.id,
      message: 'QR code sent successfully to visitor',
      debug: {
        resultData: result.data,
        resultError: result.error
      }
    })

  } catch (error) {
    console.error('❌ Detailed error sending QR code email:', error)
    console.error('❌ Error type:', typeof error)
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('❌ Full error object:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        error: 'Failed to send QR code email',
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: error
      },
      { status: 500 }
    )
  }
} 