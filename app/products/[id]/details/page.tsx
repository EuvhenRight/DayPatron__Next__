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
		title: `${product.name} 100, 250, 500 мл - DayPatron`,
		description: product.UTP + 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
		openGraph: {
			title: `${product.name} 100, 250, 500 мл - DayPatron`,
			locale: 'uk-UA',
			description: product.UTP + 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
			url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image[0].url}`,
			type: 'website',
			images: {
				url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image[0].url}`,
				width: 1200,
				height: 630,
				alt: product.name,
			},
		},
		twitter: {
			card: 'summary_large_image',
			title: `${product.name} 100, 250, 500 мл - DayPatron`,
			description: product.UTP + 'НАЙКРАЩІ ЦІНИ, АКЦІІ, ЗАМОВИТИ! 🎯🔥',
			images: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image[0].url}`,
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
