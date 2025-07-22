
import { ThemeProvider } from '@/contexts/ThemeContext'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Crypto Analytics Dashboard',
  description: 'Real-time cryptocurrency tracking dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" >
      <body suppressHydrationWarning className={` bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 w-screen h-screen`}>
        <Providers>
        <ThemeProvider>
            {children}
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}