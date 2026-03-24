'use client'

import { useTranslations } from 'next-intl'

export default function ClientTest() {
  const t = useTranslations('home')
  
  return (
    <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
      <h2>Client Component Test</h2>
      <p><strong>Eyebrow (client):</strong> {t('eyebrow')}</p>
      <p><strong>Headline (client):</strong> {t('headline')}</p>
    </div>
  )
}
