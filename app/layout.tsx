import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500']
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500'],
  style: ['normal', 'italic']
})

export const metadata: Metadata = {
  title: 'Ensō | The Art of Breath',
  description: 'A guided breathwork course designed to quiet the mind, soften the body, and restore your natural rhythm.',
  other: {
    'dpl-variant': 'breathwork-zen',
    'dpl-concept': 'breathwork'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="dpl-variant" content="breathwork-zen" />
        <meta name="dpl-concept" content="breathwork" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
