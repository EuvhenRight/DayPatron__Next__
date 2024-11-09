// pages/_app.tsx
import SEO from '@/next-seo.config'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<DefaultSeo {...SEO} />
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
