import type { Metadata, Viewport } from 'next'
import { Noto_Sans } from 'next/font/google'
import StoreProvider from './StoreProvider'
import '@/styles/globals.sass'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Discord 3.0',
  description: 'A Discord clone built with Next.js',
}

export const viewport: Viewport = {
  themeColor: '#1e1f22',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={notoSans.variable}>
    <body>
      <StoreProvider>{children}</StoreProvider>
    </body>
  </html>
)

export default RootLayout
