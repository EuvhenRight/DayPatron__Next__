import { auth } from '@/auth'
import { Header } from '@/components/Header/Header'
import { Toaster } from '@/components/ui/sonner'

import { SessionProvider } from 'next-auth/react'
import { Mulish } from 'next/font/google'

import { getCart } from '@/actions/cart'
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
	const session = await auth()

	const data = await getCart(session?.user?.id as string)
	const cart = await data

	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body className={mulish.className}>
					<Header cart={cart} />
					<main>
						<Toaster />
						{children}
					</main>
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout
