import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
	title: 'DayPatron',
	description:
		'DAY Patron – ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.',
	openGraph: {
		type: 'website',
		locale: 'uk_UA',
		url: 'https://www.daypatron.com/',
		site_name: 'DayPatron',
		title: 'DayPatron',
		description:
			'DAY Patron – ідеальний супутник для тих, хто цінує бездоганність та догляд за своєю зброєю.',
		images: [
			{
				url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/DayLogo_black.svg`,
				width: 1200,
				height: 630,
				alt: 'Логотип DayPatron',
			},
		],
	},
	twitter: {
		handle: '@daypatron',
		site: '@daypatron',
		cardType: 'summary_large_image',
	},
}

export default config
