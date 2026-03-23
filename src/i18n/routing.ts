import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'de', 'ar', 'ku', 'fa', 'uk'],
  defaultLocale: 'en',
})
