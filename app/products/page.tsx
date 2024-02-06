import prisma from '@/app/lib/db/client'
import CardList from '../components/Card-list'

async function Products() {
	const productsData = await prisma?.product.findMany({
		orderBy: {
			name: 'asc',
		},
	})
	return (
		<div>
			<CardList productsData={productsData} />
		</div>
	)
}

export default Products
