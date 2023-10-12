import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import NavBar from '@/components/NavBar'
import { getPageSession } from '../../auth/lucia'

const inter = Inter({ subsets: ['latin'] })
const akiraSB = localFont({
  src: '../../public/fonts/AkiraSuperBold.ttf',
  variable: '--font-asb',
})

export const metadata: Metadata = {
  title: 'Syndicate',
  description: 'Syndicate Accounting',
}

const BASE_URL = process.env.URL || "";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getPageSession();

  return (
    <html lang="en">
      <body className={`${inter.className} ${akiraSB.variable} flex flex-col h-screen`}>
        <NavBar baseUrl={BASE_URL} session={session} />
        {children}
      </body>
    </html>
  )
}
