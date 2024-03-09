'use client'
import { useCart } from '@/app/lib/hooks/useCart'
import type { Product, ProductInCart } from '@/app/lib/types/types'
import { useEffect, useState } from 'react'
import { AiOutlineCheckSquare } from 'react-icons/ai'
import Breadcrumbs from '../Breadcrumbs'
import ImageBlock from '../ImageBlock'
import RatingInfo from '../Rating'
import Variants from '../Variants'

interface ProductInOrderBlockProps {
	product: Product
}

const ProductInOrderBlock: React.FC<ProductInOrderBlockProps> = ({
	product,
}) => {
	const { cartTotalQuantity, cartItems, handleAddToCart, showToast } = useCart()
	const [currentIndex, setCurrentIndex] = useState<number>(0)
	const [animate, setAnimate] = useState<boolean>(false)
	const [itemInCart, setItemInCart] = useState<boolean>(false)
	const [cartItem, setCartItem] = useState<ProductInCart | null>(null)

	useEffect(() => {
		setCartItem({
			id: product.id,
			name: product.name,
			volume: product.variants[currentIndex].volume,
			image: product.variants[currentIndex].image,
			quantity: 1,
			article: product.variants[currentIndex].article,
			original_price: product.variants[currentIndex].original_price,
			discount_price: product.variants[currentIndex].discount_price,
		})
	}, [currentIndex])

	useEffect(() => {
		if (cartItem) {
			cartItems?.find(item => item.article === cartItem.article)
				? setItemInCart(true)
				: setItemInCart(false)
		}
	}, [cartItem, cartItems])

	console.log(showToast)

	const stock = product.variants[currentIndex].stock!

	return (
		<section className='xl:container xl:mx-auto pt-5'>
			<div className='flex flex-row justify-between relative'>
				{showToast && (
					<div className='toast toast-end z-20'>
						<div className='alert alert-success bg-green-700 text-white rounded-none'>
							<AiOutlineCheckSquare className='mr-2' size={25} />
							<span>Товар додано в кошик. Слава Україні!</span>
						</div>
					</div>
				)}
				<div>
					<ImageBlock
						product={product}
						currentIndex={currentIndex}
						setCurrentIndex={setCurrentIndex}
						animate={animate}
						setAnimate={setAnimate}
					/>
				</div>
				<div className='flex flex-col items-end w-1/2'>
					<Breadcrumbs children={product.name} />
					<h1 className='text-typeHeader font-typeHeader uppercase space-typeHeader line-height-typeHeaderLineHeight text-end'>
						{product.name}
					</h1>
					<p className='font-bold italic my-2'>{product.UTP}</p>
					<div className='my-2 flex justify-end gap-2 mt-6'>
						<p>{product.current_rating}</p>
						<RatingInfo />
					</div>
					<Variants
						variantsProduct={product.variants}
						currentIndex={currentIndex}
						setCurrentIndex={setCurrentIndex}
						setAnimate={setAnimate}
						stock={stock}
					/>
					{itemInCart ? (
						<p className='p-3 w-1/2 text-xl my-4 flex gap-4 justify-end items-center'>
							<AiOutlineCheckSquare size={25} />
							<span>Товар у кошику</span>
						</p>
					) : (
						<button
							className='bg-btnPrimary text-white p-3 w-1/2 text-xl my-4'
							disabled={!stock}
							onClick={() => handleAddToCart(cartItem!)}
						>
							Add to cart
						</button>
					)}
					<div className='text-justify'>
						<p className='py-2'>
							<b>description: </b>
							{product.description}
						</p>
						<p className='py-2'>
							<b>shelfLie: </b>
							{product.shelfLife}
						</p>
						<p className='py-2'>
							<b>specification: </b>
							{product.specification}
						</p>
						<p className='py-2'>
							<b>useTo: </b>
							{product.useTo}
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export default ProductInOrderBlock
