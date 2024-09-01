'use client'
import { ProductsWithVariantsWithReviews } from '@/lib/types/types'
import { Advantages } from './advantages'

interface Props {
	product: ProductsWithVariantsWithReviews
}

export const AdvantagesWrapper = ({ product }: Props) => {
	const { category } = product

	return (
		<div
			className={`bg-[url('/images/carbon.jpg')] bg-no-repeat relative bg-cover bg-center h-auto py-4 md:py-10 shadow-2xl flex items-center`}
		>
			<div className='inset-0 opacity-85 w-full container mx-auto flex justify-center'>
				<Advantages category={category} />
			</div>
		</div>
	)
}
