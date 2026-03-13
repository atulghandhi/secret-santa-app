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
  const affiliateTag = process.env.AMAZON_AFFILIATE_TAG || 'santaswitch-21'
  const amazonUrl = `https://www.amazon.com/s?k=gifts&tag=${affiliateTag}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Secret Santa Assignment</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a472a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Snowflakes header decoration -->
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <tr>
            <td style="text-align: center; padding-bottom: 8px; font-size: 24px; letter-spacing: 12px; opacity: 0.7;">
              ❄️ ❄️ ❄️ ❄️ ❄️
            </td>
          </tr>
        </table>

        <!-- Main card -->
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: rgba(255,255,255,0.95); border-radius: 24px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.3);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #c0392b 0%, #e74c3c 50%, #c0392b 100%); padding: 48px 30px 40px; text-align: center; position: relative;">
              <div style="font-size: 56px; margin-bottom: 12px;">🎅</div>
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Secret Santa</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px; letter-spacing: 0.5px;">${listName}</p>
              <div style="margin-top: 16px; font-size: 16px; letter-spacing: 8px;">🎄 🎁 ⭐ 🎁 🎄</div>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 32px 16px;">
              <h2 style="margin: 0; color: #2d3748; font-size: 24px; text-align: center; font-weight: 700;">
                Ho ho ho, ${pairing.giverName}! 🎉
              </h2>
              <p style="margin: 16px 0 0; color: #4a5568; font-size: 16px; line-height: 1.7; text-align: center;">
                The elves have been busy and your Secret Santa assignment is ready! Here's who you'll be spreading holiday cheer to:
              </p>
            </td>
          </tr>
          
          <!-- Assignment Card -->
          <tr>
            <td style="padding: 16px 32px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="background: linear-gradient(135deg, #1a472a 0%, #2d8b4e 50%, #1a472a 100%); border-radius: 20px; padding: 36px 24px; text-align: center; box-shadow: 0 4px 16px rgba(26,71,42,0.3);">
                    <p style="margin: 0 0 4px; color: rgba(255,255,255,0.8); font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                      🎁 Your gift recipient is 🎁
                    </p>
                    <p style="margin: 12px 0 0; color: white; font-size: 36px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                      ${pairing.receiverName}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Secret reminder -->
          <tr>
            <td style="padding: 20px 32px 8px;">
              <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.7; text-align: center;">
                Remember — this is a <strong style="color: #c0392b;">secret</strong>! 🤫<br>
                Don't tell anyone who you're buying for.
              </p>
            </td>
          </tr>

          <!-- Amazon CTA -->
          <tr>
            <td style="padding: 28px 32px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fef9e7 0%, #fff8e1 100%); border-radius: 16px; border: 2px solid #f0c14b; overflow: hidden;">
                <tr>
                  <td style="padding: 28px 24px; text-align: center;">
                    <p style="margin: 0 0 4px; font-size: 28px;">🎁✨🛍️✨🎁</p>
                    <p style="margin: 0 0 8px; color: #2d3748; font-size: 18px; font-weight: 700;">
                      Need gift ideas?
                    </p>
                    <p style="margin: 0 0 20px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                      Find the perfect present — browse thousands of gift ideas for everyone on your list!
                    </p>
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${amazonUrl}" style="height:56px;v-text-anchor:middle;width:340px;" arcsize="50%" fillcolor="#FF9900">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:'Segoe UI',sans-serif;font-size:18px;font-weight:bold;">🎄 Find the Perfect Gift →</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${amazonUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #FF9900 0%, #e88b00 100%); color: white; text-decoration: none; font-size: 18px; font-weight: 700; padding: 16px 40px; border-radius: 50px; box-shadow: 0 4px 16px rgba(255,153,0,0.4); letter-spacing: 0.3px;">
                      🎄 Find the Perfect Gift →
                    </a>
                    <!--<![endif]-->
                    <p style="margin: 14px 0 0; color: #718096; font-size: 12px;">
                      Browse top-rated gifts on Amazon
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tips -->
          <tr>
            <td style="padding: 8px 32px 32px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: #f0faf4; border-radius: 16px; border: 1px solid #c6f6d5;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px; color: #2d3748; font-weight: 700; font-size: 15px;">
                      ✨ Gift-giving tips:
                    </p>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">🎯 Think about their hobbies and interests</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">💝 Something thoughtful beats something expensive</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">🎀 Wrap it nicely — presentation matters!</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">✉️ Include a card (but keep it anonymous!)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a472a 0%, #2d6b3f 100%); padding: 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 20px; letter-spacing: 6px;">🎄 ❄️ 🎅 ❄️ 🎄</p>
              <p style="margin: 0 0 8px; color: rgba(255,255,255,0.9); font-size: 15px; font-weight: 600;">
                Happy Holidays!
              </p>
              <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 11px;">
                Sent with ❤️ from Secret Santa Gift Exchange
              </p>
            </td>
          </tr>
          
        </table>

        <!-- Snowflakes footer decoration -->
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse;">
          <tr>
            <td style="text-align: center; padding-top: 12px; font-size: 24px; letter-spacing: 12px; opacity: 0.7;">
              ❄️ ❄️ ❄️ ❄️ ❄️
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
