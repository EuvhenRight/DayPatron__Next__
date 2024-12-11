import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: [
				'/admin',
				'/admin/*',
				'/dashboard',
				'/dashboard/*',
				'/auth',
				'/auth/*',
			],
		},
		sitemap: `${process.env.NEXT_PUBLIC_API_URL}/sitemap.xml`,
	}
}
