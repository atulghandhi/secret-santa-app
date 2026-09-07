import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const compiledDirectory = mkdtempSync(join(tmpdir(), 'santa-switch-email-test-'))
after(() => rmSync(compiledDirectory, { recursive: true, force: true }))

execFileSync(process.execPath, [
  join(projectRoot, 'node_modules/typescript/bin/tsc'),
  'lib/email.ts',
  '--outDir', compiledDirectory,
  '--module', 'commonjs',
  '--moduleResolution', 'node',
  '--target', 'es2020',
  '--skipLibCheck',
], { cwd: projectRoot })

const require = createRequire(import.meta.url)
const { generatePairingEmail } = require(join(compiledDirectory, 'email.js'))
const { AMAZON_GIFT_URL, AMAZON_AFFILIATE_DISCLOSURE } = require(join(compiledDirectory, 'affiliate.js'))
const pairing = { giverName: 'Alex', giverEmail: 'alex@example.com', receiverName: 'Sam' }

function loadEmailRoute({ apiKey, fetch } = {}) {
  const { transpileModule, ModuleKind } = require('typescript')
  const source = readFileSync(join(projectRoot, 'app/api/send-emails/route.ts'), 'utf8')
  const compiled = transpileModule(source, { compilerOptions: { module: ModuleKind.CommonJS } }).outputText
  const routeModule = { exports: {} }
  runInNewContext(compiled, {
    exports: routeModule.exports,
    module: routeModule,
    require: (specifier) => specifier === '@/lib/email'
      ? { generatePairingEmail }
      : require(specifier),
    process: { env: { RESEND_API_KEY: apiKey } },
    console: { error() {} },
    fetch: fetch ?? (() => { throw new Error('Unexpected outbound email attempt') }),
    setTimeout,
  })
  return routeModule.exports
}

test('every email format uses the UK Store ID and discloses the affiliate link', () => {
  const email = generatePairingEmail(pairing, 'Office Secret Santa')
  const url = new URL(AMAZON_GIFT_URL)
  assert.equal(url.protocol, 'https:')
  assert.equal(url.hostname, 'www.amazon.co.uk')
  assert.equal(url.searchParams.get('tag'), 'santaswitch-21')
  assert.equal(url.searchParams.get('k'), 'secret santa gifts')
  assert.ok(email.html.includes(AMAZON_GIFT_URL.replaceAll('&', '&amp;')))
  assert.ok(email.text.includes(AMAZON_GIFT_URL))
  assert.ok(email.html.includes(AMAZON_AFFILIATE_DISCLOSURE))
  assert.ok(email.text.includes(AMAZON_AFFILIATE_DISCLOSURE))
  assert.ok(email.html.includes('rel="sponsored nofollow noopener"'))
})

test('user-supplied names cannot inject HTML or extra email headers', () => {
  const hostile = {
    giverName: '<img src=x onerror="alert(1)">',
    giverEmail: 'alex@example.com',
    receiverName: "Sam & Lee's <script>bad()</script>",
  }
  const listName = '<a href="https://unwanted.example">Office</a>\r\nBcc: someone@example.com'
  const email = generatePairingEmail(hostile, listName)
  assert.ok(!email.html.includes(hostile.giverName))
  assert.ok(!email.html.includes('<script>'))
  assert.ok(!email.html.includes('<a href="https://unwanted.example">'))
  assert.ok(email.html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'))
  assert.ok(email.html.includes('Sam &amp; Lee&#39;s &lt;script&gt;bad()&lt;/script&gt;'))
  assert.ok(!/[\r\n]/.test(email.subject))
  assert.ok(email.text.includes(hostile.receiverName))
})

test('each email reveals only the supplied assignment and never puts personal data in the gift URL', () => {
  const email = generatePairingEmail(pairing, 'Office Secret Santa')
  assert.ok(email.text.includes('You are buying a gift for: Sam'))
  assert.ok(email.html.includes('Sam'))
  assert.ok(!email.html.includes(pairing.giverEmail))
  assert.ok(!email.text.includes(pairing.giverEmail))
  const links = [...email.html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])
  assert.deepEqual(links, [AMAZON_GIFT_URL.replaceAll('&', '&amp;')])
})

test('hosted Supabase templates retain the confirmation action and the same affiliate destination', () => {
  const confirmation = readFileSync(join(projectRoot, 'supabase/templates/confirmation.html'), 'utf8')
  const footer = readFileSync(join(projectRoot, 'supabase/templates/affiliate-footer.html'), 'utf8')
  assert.ok(confirmation.includes('href="{{ .ConfirmationURL }}"'))
  for (const html of [confirmation, footer]) {
    assert.ok(html.includes(AMAZON_GIFT_URL.replaceAll('&', '&amp;')))
    assert.ok(html.includes(AMAZON_AFFILIATE_DISCLOSURE))
  }
})

test('email endpoint rejects invalid JSON and incomplete assignments before delivery', async () => {
  const { POST } = loadEmailRoute({ apiKey: 'test-only' })
  assert.equal((await POST({ json: async () => { throw new SyntaxError('bad JSON') } })).status, 400)
  for (const body of [
    { listName: 'Office', pairings: [] },
    { listName: 'Office', pairings: [{ ...pairing, giverEmail: 'invalid' }] },
    { listName: 'Office', pairings: [{ ...pairing, receiverName: undefined }] },
    { listName: 'Office\nBcc: unwanted@example.com', pairings: [pairing] },
  ]) {
    const response = await POST({ json: async () => body })
    assert.equal(response.status, 400)
  }
})

test('email endpoint never reports delivery when the provider is unconfigured', async () => {
  const { POST } = loadEmailRoute()
  const response = await POST({ json: async () => ({ listName: 'Office', pairings: [pairing] }) })
  assert.equal(response.status, 503)
  assert.ok((await response.json()).error)
})

test('provider payload contains both disclosed affiliate email formats for each individual recipient', async () => {
  const deliveries = []
  const { POST } = loadEmailRoute({ apiKey: 'test-only', fetch: async (url, request) => {
    assert.equal(url, 'https://api.resend.com/emails')
    deliveries.push(JSON.parse(request.body))
    return { ok: true, json: async () => ({ id: 'mocked-email' }) }
  } })
  const response = await POST({ json: async () => ({ listName: 'Office', pairings: [pairing] }) })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true, sent: 1, failed: 0, total: 1 })
  assert.equal(deliveries.length, 1)
  assert.equal(deliveries[0].to, pairing.giverEmail)
  assert.ok(deliveries[0].html.includes(AMAZON_GIFT_URL.replaceAll('&', '&amp;')))
  assert.ok(deliveries[0].text.includes(AMAZON_GIFT_URL))
})

test('provider failures report accurate counts for partial and total failure', async () => {
  for (const failures of [1, 2]) {
    let delivery = 0
    const { POST } = loadEmailRoute({ apiKey: 'test-only', fetch: async () => {
      delivery += 1
      return { ok: delivery > failures, status: 500, json: async () => ({ id: 'mocked-email' }) }
    } })
    const response = await POST({ json: async () => ({ listName: 'Office', pairings: [pairing, { ...pairing, giverEmail: 'sam@example.com' }] }) })
    assert.equal(response.status, failures === 2 ? 502 : 200)
    const result = await response.json()
    assert.equal(result.success, false)
    assert.equal(result.sent, 2 - failures)
    assert.equal(result.failed, failures)
    assert.equal(result.total, 2)
  }
})
