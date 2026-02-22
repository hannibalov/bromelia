import { createI18nMiddleware } from 'next-international/middleware'
import type { NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'es'
})

export function proxy(request: NextRequest) {
    return I18nMiddleware(request)
}

export default proxy;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)']
}
