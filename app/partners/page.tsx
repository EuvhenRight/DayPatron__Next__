import { FeaturedOn } from '@/components/FeaturedOn/featured-on'
import { getAllProducts } from '@/lib/services/products'

export default async function WhereToBuyPage() {
	// FETCH ALL PRODUCTS
	const dataProducts = await getAllProducts()
	return (
		<section className='container'>
			<FeaturedOn />
		</section>
	)
}
