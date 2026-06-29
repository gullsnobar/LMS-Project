import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes';
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import Providers from "./Provider";
import Custom from './components/Custom';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export const metadata: Metadata = {
  title: 'ELearning - Learn from the Best | Online Courses Platform',
  description: 'Join 500K+ students learning from 40K+ online courses. Improve your skills with expert instructors. Start your learning journey today with ELearning.',
  keywords: 'online learning, courses, education, programming, skills development, e-learning platform',
  authors: [{ name: 'ELearning Team' }],
  openGraph: {
    title: 'ELearning - Transform Your Future with Quality Education',
    description: 'Access 40K+ online courses and join 500K+ students worldwide. Learn from industry experts.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <Custom>{children}</Custom>
            <Toaster position='top-center' reverseOrder={false} />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
