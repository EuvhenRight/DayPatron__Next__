import { BreadcrumbProduct } from '@/components/ProductForm/breadcrumb'
import { CarouselMixCards } from '@/components/Slider/Carousel'
import { ProductsWithVariants } from '@/lib/types/types'
import { getAllProducts } from './api-products'

const Products = async () => {
	const dataProducts: ProductsWithVariants[] = await getAllProducts()
	return (
		<div className='flex flex-col items-center justify-center'>
			<BreadcrumbProduct />
			<CarouselMixCards dataProducts={dataProducts} />
		</div>
	)
}

export default Products
