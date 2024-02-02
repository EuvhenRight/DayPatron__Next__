import { Card } from '@/app/components/Card'
import { incrementProductQuantity } from '../api/products/[id]/actions'
import prisma from '../lib/db/client'
export default async function Products() {
	const allProducts = await prisma?.product.findMany({
		orderBy: {
			name: 'asc',
		},
	})

	return (
		<div>
			<Card
				products={allProducts}
				incrementProductQuantity={incrementProductQuantity}
			/>
		</div>
	)
}
