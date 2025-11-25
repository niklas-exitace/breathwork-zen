import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, variant } = body

    // TODO: Connect to your CRM/email service
    // Examples: Mailchimp, ConvertKit, Klaviyo, Resend

    console.log('Lead captured:', { email, variant, timestamp: new Date().toISOString() })

    // Return success with PDF URL
    return NextResponse.json({
      success: true,
      leadId: `lead_${Date.now()}`,
      pdfUrl: '/hooks/breathwork/5-techniques-zen.pdf'
    })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to capture lead' },
      { status: 500 }
    )
  }
}
