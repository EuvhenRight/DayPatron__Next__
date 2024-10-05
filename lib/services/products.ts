import prisma from '@/lib/db/client'
import {
	ProductsWithVariantsWithReviews,
	ProductWithVariantsWithReviews,
} from '@/lib/types/types'
import { Product } from '@prisma/client'
import { cache } from 'react'

export const getAllProducts = cache(
	async (): Promise<ProductsWithVariantsWithReviews[]> => {
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
)

export const getProduct = cache(
	async (id: string): Promise<ProductWithVariantsWithReviews> => {
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
)

export const getSearchProducts = cache(
	async (searchQuery: string): Promise<Product[]> => {
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
)
