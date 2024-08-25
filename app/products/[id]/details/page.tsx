import { AdvantagesWrapper } from '@/components/Advantages/advantages-wrapper'
import { ProductForm } from '@/components/ProductForm/product-form'
import { Reviews } from '@/components/Reviews/reviews'
import { getCart } from '@/lib/services/cart'
import { getProduct } from '@/lib/services/products'
import { Metadata } from 'next'

interface Props {
	params: {
		id: string
	}
}

export const generateMetadata = async ({
	params: { id },
}: Props): Promise<Metadata> => {
	const product = await getProduct(id)

	return {
		title: product?.name,
		description: product?.UTP,
		// openGraph: {
		// 	images: [{ url: product?.variant[0].image }],
		// },
		// TODO: ADD TWITTER METADATA, ADD PHOTO
	}
}

const ProductDetails = async ({ params: { id } }: Props) => {
	const [cart, product] = await Promise.all([getCart(), getProduct(id)])
	return (
		<>
			<section className='container pt-8'>
				<ProductForm product={product} cart={cart} />
			</section>
			<section className='py-14'>
				<AdvantagesWrapper product={product} />
			</section>
			<section className='container '>
				<Reviews />
			</section>
		</>
	)
}

export default ProductDetails
