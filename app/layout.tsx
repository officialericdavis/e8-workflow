import './amplify-config';
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E8 Workflow Manager (Mock)',
  description: 'UI mock for E8 Productions Workflow System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
