import { auth } from '@/auth'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Mulish } from 'next/font/google'
import ClientLayout from './clientLayout'
import './globals.css'
const mulish = Mulish({
	weight: ['200', '300', '400', '500', '600', '700'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'DayPatron',
	description: 'Догляд, що перевершує очікування',
}

async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await auth()
	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body className={mulish.className}>
					<ClientLayout>{children}</ClientLayout>
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout
