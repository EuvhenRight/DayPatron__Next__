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

// METADATA GENERATOR
export const metadata: Metadata = {
	title: 'DayPatron',
	description:
		'Ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.',
	openGraph: {
		title: 'DayPatron',
		locale: 'uk-UA',
		description:
			'Ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.',
		url: `https://daypatron.com`,
		type: 'website',
		images: [
			{
				url: `${process.env.PUBLIC_IMAGE_URL}/DayLogo_black.svg`,
				width: 800,
				height: 600,
				alt: 'DayPatronLogo',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'DayPatron',
		description:
			'Ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.',
		site: 'https://daypatron.com',
		creator: 'daypatronteam',
		images: `${process.env.PUBLIC_IMAGE_URL}/DayLogo_black.svg`,
	},
}

async function RootLayout({ children }: { children: React.ReactNode }) {
	// FETCH USER
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
