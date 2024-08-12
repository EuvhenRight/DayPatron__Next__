import data from '@/lib/db/content.json'
import { Product } from '@prisma/client'
import Link from 'next/link'

interface Props {
	products: Product[]
}

export const LinkFooterProducts = ({ products }: Props) => {
	const { ContentFooter } = data
	return (
		<div className='mb-4'>
			<h3 className='text-white uppercase font-bold py-4 hidden md:block'>
				{ContentFooter.links.productsTitle}
			</h3>
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
