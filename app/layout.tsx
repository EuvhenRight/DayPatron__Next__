import { auth } from '@/auth'
import { Header } from '@/components/Header/Header'

import { SessionProvider } from 'next-auth/react'
import { Mulish } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { getCart } from '@/lib/db/cart'
import type { Metadata } from 'next'
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
	// FETCH USER
	const [session, cart] = await Promise.all([auth(), getCart()])

	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body className={mulish.className}>
					<Header cart={cart} />
					<main className='mt-28'>
						{children}
						<Toaster richColors />
					</main>
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout
