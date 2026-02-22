"use client"
import { useChangeLocale, useCurrentLocale } from '../../locales/client'

export default function LanguageSwitcher() {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLocale('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-green-600 text-white'
            : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLocale('es')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'es'
            ? 'bg-green-600 text-white'
            : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
        }`}
      >
        ES
      </button>
    </div>
  )
}
