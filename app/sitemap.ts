import { getAllProducts } from '@/lib/services/products'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await getAllProducts()

	const pageEntries = products.map(product => ({
		url: `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}/details`,
		lastModified: new Date().toISOString(),
		changefreq: 'monthly',
		priority: 0.9,
	}))

	return Promise.resolve([
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/`,
			lastModified: new Date().toISOString(),
			changefreq: 'daily',
			priority: 1.0,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/about`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/contacts`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/partners`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/products`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.9,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.6,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.6,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/privacy`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/delivery`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/warranty`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/guide`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/profile`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/information`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/order`,
			lastModified: new Date().toISOString(),
			changefreq: 'monthly',
			priority: 0.8,
		},
		...pageEntries,
	])
}
