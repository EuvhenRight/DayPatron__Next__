import Footer from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { Toaster } from '@/components/ui/sonner'
import { getCart } from '@/lib/services/cart'
import getSession from '@/lib/services/getSession'
import { getAllProducts } from '@/lib/services/products'
import { mulish } from '@/lib/utils/font'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

//TODO: add generatedStaticParams

export const metadata: Metadata = {
	title: 'DayPatron',
	description:
		'DAY Patron – ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.',
	twitter: {
		card: 'summary_large_image',
	},
}

async function RootLayout({ children }: { children: React.ReactNode }) {
	// FETCH USER
	await new Promise(resolve => setTimeout(resolve, 1500))

	const [session, cart, products] = await Promise.all([
		getSession(),
		getCart(),
		getAllProducts(),
	])

	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body className={mulish.className}>
					<Header cart={cart} />
					<main className='mt-28 sm:min-h-screen'>
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
