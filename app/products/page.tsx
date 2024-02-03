import { Card } from '@/app/components/Card'
import prisma from '../lib/db/client'
export default async function Products() {
	const productsData = await prisma?.product.findMany({
		orderBy: {
			name: 'asc',
		},
	})

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{productsData?.map(product => (
				<Card key={product.id} product={product} />
			))}
		</div>
	)
}
