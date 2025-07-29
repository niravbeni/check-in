import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { CheckInNotificationData } from '@/types'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const notificationData: CheckInNotificationData = await request.json()
    
    // Validate required fields
    if (!notificationData.hostEmail || !notificationData.visitorName || !notificationData.visitorCompany) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const fromEmail = process.env.FROM_EMAIL || 'noreply@yourdomain.com'

    // Create the email content
    const emailSubject = `Visitor Check-In Notification - ${notificationData.visitorName}`
    
    // Format check-in time
    const checkedInTime = new Date(notificationData.checkedInAt).toLocaleString()
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Visitor Check-In Notification</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px 20px; }
            .alert { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
            .details { background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e9ecef; }
            .detail-row:last-child { margin-bottom: 0; border-bottom: none; }
            .label { font-weight: 600; color: #495057; }
            .value { color: #6c757d; }
            .notes { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Visitor Check-In Notification</h1>
              <p>Your visitor has successfully checked in</p>
            </div>
            
            <div class="content">
              <div class="alert">
                <strong>${notificationData.visitorName}</strong> from <strong>${notificationData.visitorCompany}</strong> has checked in to the building.
              </div>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #495057;">Visitor Details</h3>
                
                <div class="detail-row">
                  <span class="label">Visitor Name:</span>
                  <span class="value">${notificationData.visitorName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Company:</span>
                  <span class="value">${notificationData.visitorCompany}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Check-In Time:</span>
                  <span class="value">${checkedInTime}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">Purpose of Visit:</span>
                  <span class="value">${notificationData.purpose}</span>
                </div>
              </div>
              
              ${notificationData.identificationNotes || notificationData.locationNotes ? `
                <div class="notes">
                  <h4 style="margin-top: 0; color: #856404;">Additional Notes:</h4>
                  ${notificationData.identificationNotes ? `<p><strong>Identification:</strong> ${notificationData.identificationNotes}</p>` : ''}
                  ${notificationData.locationNotes ? `<p><strong>Location:</strong> ${notificationData.locationNotes}</p>` : ''}
                </div>
              ` : ''}
              
              <p style="color: #6c757d; font-size: 14px;">
                This is an automated notification from the QR Code Visitor System. 
                Your visitor has been successfully checked in and should now be able to proceed to your meeting location.
              </p>
            </div>
            
            <div class="footer">
              <p>QR Code Visitor System • Secure • Professional • Efficient</p>
              <p>This email was sent automatically. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
Visitor Check-In Notification

${notificationData.visitorName} from ${notificationData.visitorCompany} has checked in to the building.

Visitor Details:
- Name: ${notificationData.visitorName}
- Company: ${notificationData.visitorCompany}
- Check-In Time: ${checkedInTime}
- Purpose: ${notificationData.purpose}

${notificationData.identificationNotes ? `Identification Notes: ${notificationData.identificationNotes}` : ''}
${notificationData.locationNotes ? `Location Notes: ${notificationData.locationNotes}` : ''}

This is an automated notification from the QR Code Visitor System.

---
QR Code Visitor System • Secure • Professional • Efficient
    `

    console.log('🚀 Sending confirmation email to:', notificationData.hostEmail)
    console.log('📧 From email:', fromEmail)
    console.log('🔑 API Key exists:', !!process.env.RESEND_API_KEY)

    // Send the email using Resend
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: notificationData.hostEmail,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    })

    console.log('✅ Full Resend response:', JSON.stringify(emailResponse, null, 2))
    console.log('📧 Email ID:', emailResponse.data?.id)
    
    if (emailResponse.error) {
      console.error('❌ Resend API Error:', emailResponse.error)
      throw new Error(`Resend API Error: ${JSON.stringify(emailResponse.error)}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
      emailId: emailResponse.data?.id
    })

  } catch (error) {
    console.error('Error sending confirmation email:', error)
    
    // Return a user-friendly error message
    return NextResponse.json(
      { 
        error: 'Failed to send confirmation email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 