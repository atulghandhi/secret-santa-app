import assert from 'node:assert/strict'

const base = process.env.TEST_BASE_URL || 'http://localhost:3000'
const canonical = process.env.NEXT_PUBLIC_SITE_URL
assert.ok(canonical, 'Set NEXT_PUBLIC_SITE_URL to the same origin used at build time')
const paths = ['/', '/secret-santa-rules', '/secret-santa-for-work', '/secret-santa-gift-ideas']
const titles = new Set()

for (const path of paths) {
  const response = await fetch(new URL(path, base), { headers: { 'User-Agent': 'Googlebot' } })
  assert.equal(response.status, 200, path)
  const html = await response.text()
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]
  assert.ok(title, `${path} has a title`)
  assert.ok(!titles.has(title), `${path} has a distinct title`)
  titles.add(title)
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path} has one main heading`)
  assert.ok(html.includes(`rel="canonical" href="${new URL(path, canonical).href}"`), `${path} canonical`)
  assert.match(html, /name="description" content="[^"]{50,}"/)
  assert.match(html, /property="og:image"/)
  assert.match(html, /name="robots" content="index, follow/)
  assert.ok(!/href="https:\/\/www\.amazon\./.test(html), `${path} must not show an affiliate link before a draw`)
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  assert.ok(jsonLd.length, `${path} has structured data`)
  jsonLd.forEach(([, json]) => assert.equal(JSON.parse(json)['@context'], 'https://schema.org'))
  if (path === '/') {
    assert.match(html, /How does this Secret Santa generator work\?/)
    paths.slice(1).forEach((guide) => assert.ok(html.includes(`href="${guide}"`), `Home links to ${guide}`))
  }
}

for (const path of ['/auth/login', '/auth/sign-up', '/history', '/view/test-list', '/?list=test-list']) {
  const response = await fetch(new URL(path, base), { headers: { 'User-Agent': 'Googlebot' } })
  assert.equal(response.status, 200, path)
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/)
  assert.match(await response.text(), /name="robots" content="noindex, nofollow/)
}

const robots = await (await fetch(new URL('/robots.txt', base))).text()
assert.match(robots, /User-Agent: \*/i)
assert.match(robots, /Allow: \//)
assert.match(robots, /Disallow: \/api\//)
assert.ok(!/Disallow: \/(?:auth|view|history)/.test(robots), 'Private HTML must be crawlable to expose noindex')
assert.ok(robots.includes(`Sitemap: ${new URL('/sitemap.xml', canonical).href}`))
const sitemap = await (await fetch(new URL('/sitemap.xml', base))).text()
assert.equal((sitemap.match(/<loc>/g) || []).length, paths.length)
paths.forEach((path) => assert.ok(sitemap.includes(`<loc>${new URL(path, canonical).href}</loc>`)))

const image = await fetch(new URL('/opengraph-image', base))
assert.equal(image.status, 200)
assert.match(image.headers.get('content-type') || '', /image\/png/)
const png = Buffer.from(await image.arrayBuffer())
assert.equal(png.readUInt32BE(16), 1200)
assert.equal(png.readUInt32BE(20), 630)
console.log('SEO smoke checks passed: public HTML, private noindex, links, schema, sitemap, robots and social image.')
