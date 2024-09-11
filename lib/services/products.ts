import prisma from '@/lib/db/client'
import {
	ProductsWithVariantsWithReviews,
	ProductWithVariantsWithReviews,
} from '@/lib/types/types'

export async function getAllProducts(): Promise<
	ProductsWithVariantsWithReviews[]
> {
	const products = await prisma?.product.findMany({
		include: {
			variant: true,
			reviews: {
				include: {
					messages: true,
				},
			},
		},
	})
	if (!products) {
		throw new Error('Products not found')
	}

	return products
}

export async function getProduct(
	id: string
): Promise<ProductWithVariantsWithReviews> {
	const product = await prisma?.product.findUnique({
		where: {
			id,
		},
		include: {
			variant: true,
			reviews: {
				include: {
					messages: true,
				},
			},
		},
	})

	if (!product) {
		throw new Error('Product not found')
	}

	return product
}

export async function getSearchProducts(searchQuery: string) {
	// Search products by name
	const search = await prisma.product.findMany({
		where: {
			OR: [
				{
					name: {
						contains: searchQuery,
						mode: 'insensitive',
					},
				},
				{
					description: {
						contains: searchQuery,
						mode: 'insensitive',
					},
				},
			],
		},
	})

	// Search products by name or other fields
	return search
}
