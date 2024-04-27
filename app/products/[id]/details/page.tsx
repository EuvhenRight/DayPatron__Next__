import { Product } from '.prisma/client'
import ProductInOrderBlock from '@/components/ProductInOrderBlock'
import prisma from '@/lib/db/client'
import { Metadata } from 'next'
import { cache } from 'react'
import { getProduct } from '../../api-products'

interface ProductDetailsProps {
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
}: ProductDetailsProps): Promise<Metadata> => {
	const product = await getProduct(id)

	return {
		title: product?.name,
		description: product?.UTP,
		// openGraph: {
		// 	images: [{ url: product?.variants[0].image }],
		// },
	}
}

const ProductDetails = async ({ params: { id } }: ProductDetailsProps) => {
	const product: Product = await getProduct(id)

	return (
		<>
			<ProductInOrderBlock product={product} />
		</>
	)
}

export default ProductDetails
