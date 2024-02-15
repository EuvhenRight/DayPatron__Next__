import Breadcrumbs from '@/app/components/Breadcrumbs'
import RatingInfo from '@/app/components/Rating'
import Variants from '@/app/components/Variants'
import prisma from '@/app/lib/db/client'
import { Metadata } from 'next'
import React, { cache } from 'react'

interface ProductDetailsProps {
	params: {
		id: string
	}
}
const getProduct = cache(async (id: string) => {
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

const ProductDetails: React.FC<ProductDetailsProps> = async ({
	params: { id },
}: ProductDetailsProps) => {
	const product = await getProduct(id)

	return (
		<div className='xl:container xl:mx-auto flex flex-col lg:flex-row'>
			<div>
				<div>
					<img
						src={`/images/${product.variants[1].image}`}
						alt={product?.name}
						className='w-full h-full object-cover'
					/>
				</div>
			</div>
			<div className='flex flex-col items-end'>
				<Breadcrumbs children={product.name} />
				<RatingInfo />
				<p>{product.current_rating}</p>
				<h1 className='text-typeHeader font-typeHeader uppercase space-typeHeader line-height-typeHeaderLineHeight'>
					{product.name}
				</h1>
				<p>{product.UTP}</p>
				<Variants variants={product.variants} />
				<button className='bg-btnPrimary text-white p-2'>Add to cart</button>
				<div>
					<p>{product.description}</p>
					<p>{product.shelfLife}</p>
					<p>{product.specification}</p>
					<p>{product.useTo}</p>
				</div>
			</div>
		</div>
	)
}

export default ProductDetails
