import { ProductsWithVariants } from '../types/types'

export async function getAllProducts(): Promise<ProductsWithVariants[]> {
	const products = await prisma?.product.findMany({
		include: {
			variant: true,
		},
	})
	if (!products) {
		throw new Error('Products not found')
	}

	return products
}

export async function getProduct(id: string): Promise<ProductsWithVariants> {
	const product = await prisma?.product.findUnique({
		where: {
			id,
		},
		include: {
			variant: true,
		},
	})

	if (!product) {
		throw new Error('Product not found')
	}

	return product
}
