'use client'
import { advantageProps } from '@/lib/db/advantages'
import { ProductsWithVariants } from '@/lib/types/types'
import { Advantages } from './advantages'

interface Props {
	product: ProductsWithVariants
}

export const AdvantagesWrapper = ({ product }: Props) => {
	const { category } = product
	const properties = (category: string) => {
		return advantageProps.find(advantage => advantage.category === category)
	}
	// DESTRUCTURE PROPERTIES
	const { color } = properties(category)!
	return (
		<div
			className={`bg-[url('/images/carbon.jpg')] bg-no-repeat relative bg-cover bg-center h-[400px] border${color} border-y-4 flex items-center`}
		>
			<div className='inset-0 opacity-85 w-full'>
				<Advantages category={category} />
			</div>
		</div>
	)
}
