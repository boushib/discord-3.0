import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import StoreProvider from './StoreProvider'
import '@/styles/globals.sass'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Discord 3.0',
  description: 'A Discord clone built with Next.js',
}

export const viewport: Viewport = {
  themeColor: '#202225',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={poppins.variable}>
    <body>
      <StoreProvider>{children}</StoreProvider>
    </body>
  </html>
)

export default RootLayout
