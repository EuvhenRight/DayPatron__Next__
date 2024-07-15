import { AdvantagesWrapper } from '@/components/Advantages/advantages-wrapper'
import { ProductForm } from '@/components/ProductForm/product-form'
import { getCart } from '@/lib/db/cart'
import { getProduct } from '@/lib/db/products'
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
			<section className='pt-14'>
				<AdvantagesWrapper product={product} />
			</section>
		</>
	)
}

export default ProductDetails
