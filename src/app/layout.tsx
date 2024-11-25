import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./../components/navbar"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "A2B Rentals",
  description: "AtoB Rentals, THE car rental company",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="color-scheme" content="light only"></meta>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" enableSystem={false} enableColorScheme={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
