import { getProduct } from '@/app/products/api-products'
import { ProductForm } from '@/components/ProductForm/product-form'
import { getCart } from '@/lib/db/cart'
import prisma from '@/lib/db/client'
import { ProductsWithVariants } from '@/lib/types/types'
import { Metadata } from 'next'
import { cache } from 'react'

interface Props {
	params: {
		id: string
	}
}

const getProductOne = cache(async (id: string) => {
	const product = await prisma?.product.findUnique({
		where: {
			id,
		},
	})
	if (!product) throw new Error('Product not found')
	return product
})

export const generateMetadata = async ({
	params: { id },
}: Props): Promise<Metadata> => {
	const product = await getProductOne(id)

	return {
		title: product?.name,
		description: product?.UTP,
		// openGraph: {
		// 	images: [{ url: product?.variants[0].image }],
		// },
	}
}

const ProductDetails = async ({ params: { id } }: Props) => {
	const product: ProductsWithVariants = await getProduct(id)
	const cart = await getCart()

	return (
		<>
			<ProductForm product={product} cart={cart} />
		</>
	)
}

export default ProductDetails
