import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generatePairingEmail, type PairingEmail } from '@/lib/email'

const nameSchema = z.string().trim().min(1).max(200).regex(/^[^\r\n\x00-\x1f\x7f]+$/)
const requestSchema = z.object({
  listName: nameSchema,
  pairings: z.array(z.object({
    giverName: nameSchema,
    giverEmail: z.string().trim().email().max(254),
    receiverName: nameSchema,
  })).min(1),
})

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
      const email = generatePairingEmail(pairing, listName)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Santa Switch <onboarding@resend.dev>',
          to: pairing.giverEmail,
          ...email,
        }),
      })

      if (!response.ok) {
        throw new Error(`Email provider returned status ${response.status}`)
      }

      return response.json()
    })
  )
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Provide a list name and a valid name, email address, and recipient for every pairing.' },
      { status: 400 }
    )
  }

  const { listName, pairings } = parsed.data
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return NextResponse.json(
      { error: 'Email sending is not configured yet. Please try again later.' },
      { status: 503 }
    )
  }

  try {
    // Send individual assignments in rate-limited batches (max 2 per second).
    const allResults: PromiseSettledResult<unknown>[] = []
    for (let i = 0; i < pairings.length; i += RATE_LIMIT_PER_SECOND) {
      const batch = pairings.slice(i, i + RATE_LIMIT_PER_SECOND)
      const batchResults = await sendEmailBatch(batch, resendApiKey, listName)
      allResults.push(...batchResults)

      if (i + RATE_LIMIT_PER_SECOND < pairings.length) {
        await delay(1000)
      }
    }

    const sent = allResults.filter((result) => result.status === 'fulfilled').length
    const failed = allResults.length - sent

    if (failed > 0) {
      console.error(`Email delivery failed for ${failed} of ${pairings.length} assignments.`)
    }

    if (sent === 0) {
      return NextResponse.json(
        { success: false, sent, failed, total: pairings.length, error: 'No emails were sent. Please try again later.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: failed === 0, sent, failed, total: pairings.length })
  } catch {
    console.error('Unexpected error sending Secret Santa emails.')
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
