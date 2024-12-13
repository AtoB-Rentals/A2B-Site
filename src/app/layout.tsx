import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { NextAuthProvider } from "./providers"

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
    <html lang="en" data-theme="light">
      <head>
        <meta name="color-scheme" content="light only"></meta>
      </head>
      <body className={`${inter.className} transition-colors ease-in-out duration-1000`}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
