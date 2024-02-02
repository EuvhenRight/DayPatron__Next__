import { Card } from '@/app/components/Card'
import prisma from '@/prisma/client'
import { incrementProductQuantity } from '../api/products/[id]/actions'
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
