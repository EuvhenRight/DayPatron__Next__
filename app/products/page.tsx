import { BreadcrumbProduct } from '@/components/ProductForm/breadcrumb'
import { ProductsCard } from '@/components/Slider/products-card'
import { getAllProducts } from '@/lib/services/products'

const Products = async () => {
	// FETCH ALL PRODUCTS
	const dataProducts = await getAllProducts()
	return (
		<section className='flex flex-col items-center justify-center container'>
			{/* BREADCRUMB */}
			<div className='my-10'>
				<BreadcrumbProduct />
			</div>
			<ul className='grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
				{dataProducts.toReversed().map(product => (
					<li key={product.id}>
						<ProductsCard product={product} />
					</li>
				))}
			</ul>
		</section>
	)
}

export default Products
