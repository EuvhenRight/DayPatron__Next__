import { SaleComponent } from '@/components/Banner/sale-component'
import Footer from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { Toaster } from '@/components/ui/sonner'
import { getCart } from '@/lib/services/cart'
import getSession from '@/lib/services/getSession'
import { getAllProducts } from '@/lib/services/products'
import { geologica } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

export const metadata: Metadata = {
	title: 'Головна | DayPatron',
	description: 'Український виробник засобів догляду за зброєю DayPatron 🇺🇦',
	openGraph: {
		title: 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
		description: 'Український виробник засобів догляду за зброєю DayPatron 🇺🇦',
		url: 'https://www.daypatron.com/',
		type: 'website',
		images: [
			{
				url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/2024.png`,
				width: 1200,
				height: 630,
				alt: 'DayPatron logo and product',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
		description: 'Український виробник засобів догляду за зброєю DayPatron 🇺🇦',
		images: `${process.env.NEXT_PUBLIC_IMAGE_URL}/2024.png`,
	},
}

async function RootLayout({ children }: { children: React.ReactNode }) {
	const [session, cart, products] = await Promise.all([
		getSession(),
		getCart(),
		getAllProducts(),
	])
	return (
		<html lang='en'>
			<body className={cn(geologica.className, 'font-light')}>
				<SessionProvider session={session}>
					<Analytics />
					<Header cart={cart} />
					<SaleComponent />
					<main className='mt-28 sm:min-h-screen'>
						{children}
						<Toaster richColors />
					</main>
					<Footer products={products} />
				</SessionProvider>
			</body>
		</html>
	)
}

export default RootLayout
