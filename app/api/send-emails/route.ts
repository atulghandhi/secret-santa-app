import { NextRequest, NextResponse } from 'next/server'

interface PairingEmail {
  giverName: string
  giverEmail: string
  receiverName: string
}

interface RequestBody {
  listName: string
  pairings: PairingEmail[]
}

const RATE_LIMIT_PER_SECOND = 2

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function sendEmailBatch(
  batch: PairingEmail[],
  resendApiKey: string,
  listName: string
): Promise<PromiseSettledResult<unknown>[]> {
  return Promise.allSettled(
    batch.map(async (pairing) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Secret Santa <onboarding@resend.dev>',
          to: pairing.giverEmail,
          subject: `Your Secret Santa Assignment for ${listName}!`,
          html: generateEmailHtml(pairing, listName),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to send email to ${pairing.giverEmail}: ${error}`)
      }

      return response.json()
    })
  )
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { listName, pairings } = body

    if (!listName || !pairings || !Array.isArray(pairings)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      // For demo purposes, just log and return success
      console.log('[v0] RESEND_API_KEY not configured. Would send emails to:')
      pairings.forEach((p) => {
        console.log(`[v0] - ${p.giverName} (${p.giverEmail}): You are ${p.receiverName}'s Secret Santa!`)
      })
      
      return NextResponse.json({
        success: true,
        message: 'Email sending simulated (RESEND_API_KEY not configured)',
        sent: pairings.length
      })
    }

    // Send emails in rate-limited batches (max 2 per second)
    const allResults: PromiseSettledResult<unknown>[] = []

    for (let i = 0; i < pairings.length; i += RATE_LIMIT_PER_SECOND) {
      const batch = pairings.slice(i, i + RATE_LIMIT_PER_SECOND)
      const batchResults = await sendEmailBatch(batch, resendApiKey, listName)
      allResults.push(...batchResults)

      // Wait 1 second before the next batch (skip delay after the last batch)
      if (i + RATE_LIMIT_PER_SECOND < pairings.length) {
        await delay(1000)
      }
    }

    const successful = allResults.filter((r) => r.status === 'fulfilled').length
    const failed = allResults.filter((r) => r.status === 'rejected').length

    if (failed > 0) {
      console.error(
        '[v0] Some emails failed to send:',
        allResults.filter((r) => r.status === 'rejected')
      )
    }

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      total: pairings.length
    })
  } catch (error) {
    console.error('[v0] Error sending emails:', error)
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    )
  }
}

function generateEmailHtml(pairing: PairingEmail, listName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Secret Santa Assignment</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc6b6b 0%, #c25555 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎁</div>
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Secret Santa</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">${listName}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #2d3748; font-size: 22px; text-align: center;">
                Ho ho ho, ${pairing.giverName}!
              </h2>
              
              <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
                You have been chosen to be someone's Secret Santa! 
                The elves have worked their magic and here is your assignment:
              </p>
              
              <!-- Assignment Box -->
              <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 16px; padding: 30px; text-align: center; margin: 0 0 30px;">
                <p style="margin: 0 0 10px; color: rgba(255,255,255,0.9); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Your gift recipient is
                </p>
                <p style="margin: 0; color: white; font-size: 32px; font-weight: bold;">
                  ${pairing.receiverName}
                </p>
              </div>
              
              <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
                Remember, this is a <strong>secret</strong>! Don't tell anyone who you're buying for. 
                Think about what would make them smile and spread some holiday joy!
              </p>
              
              <!-- Tips -->
              <div style="background: #f7fafc; border-radius: 12px; padding: 20px; margin: 0 0 20px;">
                <p style="margin: 0 0 10px; color: #2d3748; font-weight: bold; font-size: 14px;">
                  ✨ Gift-giving tips:
                </p>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                  <li>Think about their hobbies and interests</li>
                  <li>Consider something thoughtful over expensive</li>
                  <li>Wrap it nicely - presentation matters!</li>
                  <li>Include a small card (but keep it anonymous!)</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #718096; font-size: 14px;">
                Happy Holidays! 🎄❄️🎅
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                This email was sent from Secret Santa Gift Exchange
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
