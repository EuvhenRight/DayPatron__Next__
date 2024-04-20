'use client'
import currentUser from '@/lib/hooks/currentUser'
import type { CartItem, Product, ProductInCart } from '@/lib/types/types'
import { User } from '@prisma/client'
import axios from 'axios'
import { memo, useEffect, useState } from 'react'
import { AiOutlineCheckSquare } from 'react-icons/ai'
import Breadcrumbs from '../Breadcrumbs'
import ImageBlock from '../ImageBlock'
import RatingInfo from '../Rating'
import Variants from '../Variants'

interface ProductInOrderBlockProps {
	product: Product
}
const ProductInOrderBlock: React.FC<ProductInOrderBlockProps> = memo(
	({ product }) => {
		const [currentIndex, setCurrentIndex] = useState<number>(0)
		const [animate, setAnimate] = useState<boolean>(false)
		// CHECK ITEM IN CART
		const [itemInCart, setItemInCart] = useState<boolean>(false)
		const [cartItem, setCartItem] = useState<ProductInCart | null>(null)
		const user = currentUser() as User | null
		const userId = user?.id
		if (!user) return null
		// ADD TO CART
		useEffect(() => {
			setCartItem({
				productId: product.id,
				name: product.name,
				volume: product.variants[currentIndex].volume,
				image: product.variants[currentIndex].image,
				quantity: 1,
				article: product.variants[currentIndex].article,
				original_price: product.variants[currentIndex].original_price,
				discount_price: product.variants[currentIndex].discount_price,
			})
		}, [currentIndex])

		// CHECK ITEM IN CART ITEMS
		useEffect(() => {
			if (cartItem) {
				cartItems?.find(item => item.article === cartItem.article)
					? setItemInCart(true)
					: setItemInCart(false)
			}
		}, [cartItem, cartItems])

		const addCartItem = async (user: User | null, item: CartItem) => {
			try {
				if (!item) {
					throw new Error('Product is not defined')
				}

				const response = await axios.post(
					`http://localhost:3000/api/cart/${userId}/item`,
					item
				)

				return response.data.updatedCart // Assuming the response contains the updated cart
			} catch (error) {
				console.error(error)
				throw error // Re-throw the error to be handled by the caller
			}
		}

		// CHECK STOCKS
		const stock = product.variants[currentIndex].stock!

		return (
			<section className='xl:container xl:mx-auto pt-5'>
				<div className='flex flex-row justify-between relative'>
					{/* ADD TOAST */}
					{showToast && (
						<div className='toast toast-end z-20'>
							<div className='alert alert-success bg-green-700 text-white rounded-none'>
								<AiOutlineCheckSquare className='mr-2' size={25} />
								<span>Товар додано в кошик. Слава Україні!</span>
							</div>
						</div>
					)}
					{/* IMAGE BLOCK */}
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
							<RatingInfo rating={product.current_rating} />
							<p>{product.current_rating} відгуків</p>
						</div>
						{/* VARIANTS */}
						<Variants
							variantsProduct={product.variants}
							currentIndex={currentIndex}
							setCurrentIndex={setCurrentIndex}
							setAnimate={setAnimate}
							stock={stock}
						/>
						{/* SHOW PRODUCT IN CART */}
						{itemInCart ? (
							<p className='p-3 w-1/2 text-xl my-4 flex gap-4 justify-end items-center'>
								<AiOutlineCheckSquare size={25} />
								<span>Товар у кошику</span>
							</p>
						) : (
							// PRODUCT WITHOUT IN CART
							<button
								className='bg-btnPrimary text-white p-3 w-1/2 text-xl my-4'
								disabled={!stock}
								onClick={() => addCartItem(userId, cartItem!)}
							>
								Add to cart
							</button>
						)}
						{/* INFO BLOCK INFORMATION */}
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
)

export default ProductInOrderBlock
