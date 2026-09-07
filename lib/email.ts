import { AMAZON_AFFILIATE_DISCLOSURE, AMAZON_GIFT_URL } from './affiliate'

export interface PairingEmail {
  giverName: string
  giverEmail: string
  receiverName: string
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)
}

export function generatePairingEmail(pairing: PairingEmail, listName: string) {
  const safeListName = escapeHtml(listName)
  const giverName = escapeHtml(pairing.giverName)
  const receiverName = escapeHtml(pairing.receiverName)
  const amazonUrl = escapeHtml(AMAZON_GIFT_URL)

  return {
    subject: `Your Secret Santa assignment for ${listName.replace(/[\r\n]+/g, ' ')}!`,
    text: [
      `Ho ho ho, ${pairing.giverName}!`,
      '',
      `Your Secret Santa assignment for ${listName} is ready.`,
      `You are buying a gift for: ${pairing.receiverName}`,
      '',
      'Keep your recipient a secret! Check the budget and exchange date with your organiser.',
      '',
      `Need a little inspiration? Browse Secret Santa gifts on Amazon (affiliate link): ${AMAZON_GIFT_URL}`,
      AMAZON_AFFILIATE_DISCLOSURE,
      '',
      'Happy gifting,',
      'Santa Switch',
    ].join('\n'),
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Secret Santa assignment | Santa Switch</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#1a472a;color:#2d3748;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#fffdf9;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background-color:#b63830;padding:32px 24px;text-align:center;">
              <div style="font-size:40px;" aria-hidden="true">🎅</div>
              <h1 style="margin:8px 0;color:#ffffff;font-size:28px;">Santa Switch</h1>
              <p style="margin:0;color:#ffffff;font-size:15px;overflow-wrap:anywhere;">${safeListName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px 16px;text-align:center;">
              <h2 style="margin:0;font-size:24px;overflow-wrap:anywhere;">Ho ho ho, ${giverName}!</h2>
              <p style="margin:16px 0 0;font-size:16px;line-height:1.7;">Your Secret Santa assignment is ready. Here's who you'll be spreading holiday cheer to:</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="background-color:#1a472a;border-radius:16px;padding:28px 20px;text-align:center;">
                    <p style="margin:0;color:#ffffff;font-size:14px;">🎁 Your gift recipient is</p>
                    <p style="margin:12px 0 0;color:#ffffff;font-size:32px;font-weight:700;overflow-wrap:anywhere;">${receiverName}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px 28px;text-align:center;">
              <p style="margin:0;font-size:15px;line-height:1.7;">Keep your recipient a <strong style="color:#b63830;">secret</strong>!<br>Check the budget and exchange date with your organiser.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 28px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f0f7f1;border:1px solid #d5e6d8;border-radius:12px;">
                <tr>
                  <td style="padding:20px;text-align:center;">
                    <p style="margin:0 0 10px;font-size:15px;font-weight:600;">Need a little gift inspiration?</p>
                    <a href="${amazonUrl}" target="_blank" rel="sponsored nofollow noopener" style="color:#1a472a;font-size:15px;font-weight:600;text-decoration:underline;">Browse Secret Santa gifts on Amazon</a>
                    <p style="margin:12px 0 0;color:#4a5568;font-size:12px;line-height:1.6;">Affiliate link. ${AMAZON_AFFILIATE_DISCLOSURE}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#1a472a;padding:24px;text-align:center;">
              <p style="margin:0 0 8px;color:#ffffff;font-size:16px;">Happy gifting! 🎄</p>
              <p style="margin:0;color:#ffffff;font-size:12px;">Sent with care by Santa Switch</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  }
}
