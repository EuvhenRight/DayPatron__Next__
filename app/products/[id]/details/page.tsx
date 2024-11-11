import { AdvantagesWrapper } from '@/components/Advantages/advantages-wrapper'
import { ProductForm } from '@/components/ProductForm/product-form'
import { ReviewsComponent } from '@/components/Reviews/reviews'
import { getCart } from '@/lib/services/cart'
import { getProduct } from '@/lib/services/products'
import { getReviewsWithItem } from '@/lib/services/reviews'
import { Metadata } from 'next'

interface Props {
	params: {
		id: string
	}
}
// METADATA GENERATOR
export const generateMetadata = async ({
	params: { id },
}: Props): Promise<Metadata> => {
	const product = await getProduct(id)

	return {
		title: `${product.name}`,
		description: product.UTP + 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
		openGraph: {
			title: `${product.name}`,
			locale: 'uk-UA',
			description: product.UTP + 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
			url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Carbon-Killer-500ml_seo.png`,
			type: 'website',
			images: {
				url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Carbon-Killer-500ml_seo.png`,
				width: 630,
				height: 1200,
				alt: product.name,
			},
		},
		twitter: {
			card: 'summary_large_image',
			title: `${product.name} - DayPatron`,
			description: product.UTP,
			images: `${process.env.NEXT_PUBLIC_IMAGE_URL}/Carbon-Killer-500ml_seo.png`,
		},
	}
}

const ProductDetails = async ({ params: { id } }: Props) => {
	const [cart, product, reviews] = await Promise.all([
		getCart(),
		getProduct(id),
		getReviewsWithItem(id, 1),
	])
	return (
		<div>
			<section className='container pt-8'>
				<ProductForm product={product} cart={cart} />
			</section>
			<section className='py-10'>
				<AdvantagesWrapper product={product} />
			</section>
			<section className='max-w-screen-xl mx-auto'>
				<ReviewsComponent reviews={reviews!} product={product} />
			</section>
		</div>
	)
}

export default ProductDetails
