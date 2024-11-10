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
	openGraph: {
		type: 'website',
		locale: 'uk_UA',
		url: 'https://www.daypatron.com/',
		title: 'DayPatron',
		description:
			'DAY Patron – ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.',
		images: [
			{
				url: '/app/opengraph-image.png',
				width: 1200,
				height: 630,
				alt: 'logo DayPatron',
			},
		],
	},
	twitter: {
		card: 'summary_large_image', // Тип карточки (например, summary_large_image)
		site: '@daypatron', // Официальный Twitter аккаунт сайта
		creator: '@daypatron', // Twitter аккаунт создателя контента
		title: 'DayPatron', // Заголовок при шаринге
		description:
			'DAY Patron – ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.', // Описание при шаринге
		images: [
			{
				url: '/app/opengraph-image.png',
				width: 1200,
				height: 630,
				alt: 'logo DayPatron',
			},
		],
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
