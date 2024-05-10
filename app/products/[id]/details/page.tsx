import { getCurrentUser } from '@/actions/user'
import { getProduct } from '@/app/products/api-products'
import { ProductForm } from '@/components/ProductForm/product-form'
import prisma from '@/lib/db/client'
import { getCartQuery } from '@/lib/db/queries'
import { Prisma } from '@prisma/client'
import { Metadata } from 'next'
import { cache } from 'react'

type ProductsWithVariants = Prisma.ProductGetPayload<{
	include: { variant: true }
}>
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
	const user = await getCurrentUser()
	const product: ProductsWithVariants = await getProduct(id)
	const cart = await getCartQuery(user?.id as string)

	return (
		<>
			<ProductForm product={product} cart={cart} />
		</>
	)
}

export default ProductDetails
