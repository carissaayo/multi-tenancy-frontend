import { ReactNode } from 'react'
import { Toaster } from 'sonner';
import { Providers } from './providers'
import './globals.css'
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      </body>
    </html>
  )
}