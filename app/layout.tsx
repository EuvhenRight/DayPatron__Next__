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
	const session = await auth()

	let cart = await getCart()

	if (session) {
		cart = await getCart()
	}
	// FETCH CART

	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body className={mulish.className}>
					<Toaster />
					<Header cart={cart} />
					<main>{children}</main>
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout
