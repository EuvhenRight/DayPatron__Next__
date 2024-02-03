import { Card } from '@/app/components/Card'
import prisma from '../lib/db/client'
export default async function Products() {
	const productsData = await prisma?.product.findMany({
		orderBy: {
			name: 'asc',
		},
	})

	return (
		<div>
			{productsData?.map(product => (
				<Card key={product.id} product={product} />
			))}
		</div>
	)
}
