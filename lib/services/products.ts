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
