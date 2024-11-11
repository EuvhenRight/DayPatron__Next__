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
	title: 'Український виробник засобів догляду за зброєю',
	description: 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
	openGraph: {
		title: 'DayPatron',
		description:
			'Ідеальний деальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю. 🎯🔥',
		url: 'https://www.daypatron.com/',
		type: 'website',
		images: [
			{
				url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.png`,
				width: 1200,
				height: 630,
				alt: 'DayPatron logo and product',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Український виробник засобів догляду за зброєю',
		description:
			'Ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю. 🎯🔥',
		images: `${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.png`,
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
