import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import GlowingBackground from '@/components/GlowingBackground'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Thak Trading One Member PLC | Spices & Pulses Export',
  description: 'Premium import and export of authentic spices and legumes. Supplying quality products worldwide since 2020.',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased relative">
        <GlowingBackground />
        {children}
      </body>
    </html>
  )
}
