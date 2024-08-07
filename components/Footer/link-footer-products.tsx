import { Product } from '@prisma/client'
import Link from 'next/link'

interface Props {
	products: Product[]
}

export const LinkFooterProducts = ({ products }: Props) => {
	return (
		<div className='mb-4'>
			<h3 className='text-white uppercase font-bold py-4'>Продукти</h3>
			<ul>
				{products.map(product => (
					<li key={product.id} className='py-2'>
						<Link
							href={`/products/${product.id}/details`}
							className='text-gray-300 hover:text-white'
						>
							{product.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
