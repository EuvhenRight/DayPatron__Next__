import { BreadcrumbProduct } from '@/components/ProductForm/breadcrumb'
import { CarouselMixCards } from '@/components/Slider/Carousel'
import { getAllProducts } from '@/lib/db/products'

const Products = async () => {
	// FETCH ALL PRODUCTS
	const dataProducts = await getAllProducts()
	return (
		<div className='flex flex-col items-center justify-center'>
			<BreadcrumbProduct />
			<CarouselMixCards dataProducts={dataProducts} />
		</div>
	)
}

export default Products
