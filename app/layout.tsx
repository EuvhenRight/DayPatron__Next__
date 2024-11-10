import Footer from '@/components/Footer/Footer'
import { Header } from '@/components/Header/Header'
import { Toaster } from '@/components/ui/sonner'
import { getCart } from '@/lib/services/cart'
import getSession from '@/lib/services/getSession'
import { getAllProducts } from '@/lib/services/products'
import { mulish } from '@/lib/utils/font'
import SEO from '@/next-seo.config'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import './globals.css'

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
					<DefaultSeo {...SEO} />
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
