import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import NavBar from "./components/navbar/navbar"
import Secret from "./components/secret"
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "One Math",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          />
          <title>One Math</title>
        </head>
        <body className=" font-Thai">
          <NavBar />
          <div>{children}</div>
          <Secret />
        </body>
        <Script src="https://scripts.simpleanalyticscdn.com/latest.js"  />
      </html>
    </SessionProvider>
  )
}
