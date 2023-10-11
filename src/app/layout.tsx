import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })
const akiraSB = localFont({
  src: '../../public/fonts/AkiraSuperBold.ttf',
  variable: '--font-asb',
})

export const metadata: Metadata = {
  title: 'Syndicate',
  description: 'Syndicate Accounting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${akiraSB.variable} flex flex-col h-screen`}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
