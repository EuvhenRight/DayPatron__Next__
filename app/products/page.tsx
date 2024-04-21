import Breadcrumbs from '@/components/Breadcrumbs'
import { CarouselMixCards } from '@/components/Slider/carousel'
import { getAllProducts } from './api-products'

const Products = async () => {
	const dataProducts = await getAllProducts()

	return (
		<div className='flex flex-col items-center justify-center'>
			<Breadcrumbs />
			<CarouselMixCards dataProducts={dataProducts} />
		</div>
	)
}

export default Products
