import {getRequestConfig} from 'next-intl/server'
import {routing} from './routing'

export default getRequestConfig(async ({locale}) => {
  const safeLocale = routing.locales.includes(locale as 'zh-CN' | 'en') ? locale : routing.defaultLocale

  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default
  }
})
