import { auth } from '@/auth'
import { Header } from '@/components/Header/Header'

import { SessionProvider } from 'next-auth/react'
import { Mulish } from 'next/font/google'

import Footer from '@/components/Footer/Footer'
import { Toaster } from '@/components/ui/sonner'
import { getCart } from '@/lib/services/cart'
import { getAllProducts } from '@/lib/services/products'
import type { Metadata } from 'next'
import './globals.css'

const mulish = Mulish({
	weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'DayPatron',
	description: 'Догляд, що перевершує очікування',
}

async function RootLayout({ children }: { children: React.ReactNode }) {
	// FETCH USER
	const [session, cart, products] = await Promise.all([
		auth(),
		getCart(),
		getAllProducts(),
	])

	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body className={mulish.className}>
					<Header cart={cart} />
					<main className='mt-28 min-h-screen'>
						{children}
						<Toaster richColors />
					</main>
					<Footer products={products} />
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout
