import { getTranslations } from 'next-intl/server'
import ClientTest from './ClientTest'

export default async function TestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Translation Test</h1>
      <p><strong>Current Locale:</strong> {locale}</p>
      <p><strong>Eyebrow (server):</strong> {t('eyebrow')}</p>
      <p><strong>Headline (server):</strong> {t('headline')}</p>
      <ClientTest />
    </div>
  )
}
