import { ImageResponse } from 'next/og'

export const alt = 'Santa Switch — free Secret Santa generator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', background: '#f0f7f6', color: '#25313d', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 28, color: '#267047', marginBottom: 36 }}>SANTA SWITCH</div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>Secret Santa,</div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, color: '#b53d4b', lineHeight: 1.1 }}>all wrapped up.</div>
      <div style={{ display: 'flex', fontSize: 30, marginTop: 36 }}>Free name draw · Exclusions · Email assignments</div>
      <div style={{ display: 'flex', fontSize: 24, marginTop: 18, color: '#53626c' }}>For friends, families & teams. Start without signing up.</div>
    </div>,
    size,
  )
}
