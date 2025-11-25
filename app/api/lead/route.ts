import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, variant, quizResult, answers } = body

    // Log the lead with quiz data
    console.log('🎯 New Lead Captured:', {
      email,
      variant,
      quizResult,
      answers,
      timestamp: new Date().toISOString()
    })

    // TODO: Connect to your email service
    // Examples:
    //
    // Mailchimp:
    // await fetch(`https://us1.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ email_address: email, status: 'subscribed', tags: [quizResult] })
    // })
    //
    // ConvertKit:
    // await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
    //   method: 'POST',
    //   body: JSON.stringify({ api_key: API_KEY, email, tags: [quizResult] })
    // })
    //
    // Webhook (Zapier, Make, etc.):
    // await fetch(process.env.LEAD_WEBHOOK_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({ email, quizResult, answers, variant })
    // })

    // Return success with PDF URL based on quiz result
    const pdfUrls: Record<string, string> = {
      calm: '/guides/enso-calm-seeker.pdf',
      focus: '/guides/enso-focus-builder.pdf',
      sleep: '/guides/enso-rest-restorer.pdf',
      energy: '/guides/enso-energy-cultivator.pdf'
    }

    return NextResponse.json({
      success: true,
      leadId: `lead_${Date.now()}`,
      quizResult,
      pdfUrl: pdfUrls[quizResult] || '/guides/enso-breathwork-guide.pdf'
    })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to capture lead' },
      { status: 500 }
    )
  }
}
