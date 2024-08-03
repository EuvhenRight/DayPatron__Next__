import { BreadcrumbProduct } from '@/components/ProductForm/breadcrumb'
import { CarouselMixCards } from '@/components/Slider/carousel'
import { getAllProducts } from '@/lib/services/products'

const Products = async () => {
	// FETCH ALL PRODUCTS
	const dataProducts = await getAllProducts()
	return (
		<div className='flex flex-col items-center justify-center container'>
			<BreadcrumbProduct />
			<CarouselMixCards dataProducts={dataProducts} />
		</div>
	)
}

export default Products
