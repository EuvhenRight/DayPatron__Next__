import prisma from '@/lib/db/client'
import Breadcrumbs from '../../components/Breadcrumbs'
import CardList from '../../components/Card-list'

const Products = async () => {
	const productsData = await prisma?.product.findMany({
		orderBy: {
			name: 'asc',
		},
	})
	return (
		<div>
			<Breadcrumbs />
			<CardList productsData={productsData} />
		</div>
	)
}

export default Products
