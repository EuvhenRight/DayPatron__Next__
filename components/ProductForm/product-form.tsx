'use client'
import { BreadcrumbProduct } from '@/components/ProductForm/breadcrumb'
import { Variants } from '@/components/ProductForm/variants'
import currentUser from '@/lib/hooks/currentUser'
import type {
	CartItemWithVariants,
	CartWithVariants,
	ProductsWithVariants,
} from '@/lib/types/types'
import { User } from '@prisma/client'
import { useEffect, useState } from 'react'
import 'react-medium-image-zoom/dist/styles.css'

import { addItem } from '@/actions/cart'
import { RatingProducts } from '@/components/ProductForm/rating'
import { SliderWithProducts } from '@/components/ProductForm/slider-with-products'
import { Button } from '@/components/ui/button'
import { AiOutlineCheckSquare } from 'react-icons/ai'
import { toast } from 'sonner'

interface Props {
	product: ProductsWithVariants
	cart: CartWithVariants | null
}
export const ProductForm = ({ product, cart }: Props) => {
	// CHOOSE VARIANTS INDEX PRODUCT
	const [currentIndex, setCurrentIndex] = useState<number | null>(0)
	const [imageUrl, setImageUrl] = useState<string>(``)
	// CHOOSE IMAGE INDEX
	const [imageIndex, setImageIndex] = useState<number | null>(null)
	const [animate, setAnimate] = useState<boolean>(false)
	// CHECK ITEM IN CART
	const user = currentUser() as User | null
	const userId = user?.id
	const [itemInCart, setItemInCart] = useState<CartItemWithVariants | null>(
		null
	)

	//SERVER ACTION ADD TO CART
	const addItemToCart = (variantId: string) => {
		if (!userId || !variantId) {
			// TOAST ERROR
			toast.error('something went wrong')
		}
		const response = addItem(variantId!)

		// TOAST SUCCESS
		toast('Product added to cart', {
			position: 'bottom-right',
			icon: '🛒',
		})
		return response
	}
	// CHECK STOCK
	const stock = currentIndex !== null && product?.variant[currentIndex].stock
	// CHECK PRODUCTS IN CART
	useEffect(() => {
		const check = cart?.items?.find(item => {
			if (currentIndex === null) return
			return item.variant.article === product.variant[currentIndex!].article
		})
		setItemInCart(check || null)
	}, [cart, product, currentIndex])

	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2'>
			<div className='flex lg:flex-row flex-col lg:justify-center'>
				<div className='lg:w-1/2'>
					{/* IMAGE LIST */}
					<SliderWithProducts
						product={product}
						imageIndex={imageIndex!}
						setImageIndex={setImageIndex}
						setAnimate={setAnimate}
						animate={animate}
						imageUrl={imageUrl}
						setImageUrl={setImageUrl}
						setCurrentIndex={setCurrentIndex}
						currentIndex={currentIndex!}
					/>
				</div>
				<div className='flex flex-col items-end lg:w-1/2'>
					<div className='hidden lg:block'>
						<BreadcrumbProduct product={product} />
					</div>
					<h1 className='text-xl md:text-2xl lg:text-3xl font-bold uppercase space-y-2 line-height-[1.5] text-center lg:text-end my-1 lg:my-5 mt-0'>
						{product.name}
					</h1>
					<p className='font-bold italic my-2 text-center'>{product.UTP}</p>
					<div className='my-2 flex justify-end gap-2 mt-6'>
						<RatingProducts currentRating={product.current_rating} />
						<p>{product.current_rating} відгуків</p>
					</div>
					{/* VARIANTS */}
					<Variants
						variantsProduct={product?.variant}
						currentIndex={currentIndex!}
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
						<Button
							variant={'destructive'}
							className='p-2 my-2 text-lg'
							size='lg'
							disabled={!stock}
							onClick={() => {
								addItemToCart(product.variant[currentIndex!].id)
							}}
						>
							Add to cart
						</Button>
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

		// <section className='xl:container xl:mx-auto pt-5'>
		// 	{/* <div className='flex flex-row justify-between relative'> */}
		// 		{/* ADD TOAST */}
		// 		{/* {showToast && (
		// 			<div className='toast toast-end z-20'>
		// 				<div className='alert alert-success bg-green-700 text-white rounded-none'>
		// 					<AiOutlineCheckSquare className='mr-2' size={25} />
		// 					<span>Товар додано в кошик. Слава Україні!</span>
		// 				</div>
		// 			</div>
		// 		)} */}
		// 		{/* IMAGE BLOCK */}
		// 		{/* <div>
		// 			<ImageBlock
		// 				product={product}
		// 				currentIndex={currentIndex}
		// 				setCurrentIndex={setCurrentIndex}
		// 				animate={animate}
		// 				setAnimate={setAnimate}
		// 			/>
		// 		</div> */}
		// 		<div className='flex flex-col items-end w-1/2'>
		// 			<Breadcrumbs children={product.name} />
		// 			<h1 className='text-typeHeader font-typeHeader uppercase space-typeHeader line-height-typeHeaderLineHeight text-end'>
		// 				{product.name}
		// 			</h1>
		// 			<p className='font-bold italic my-2'>{product.UTP}</p>
		// 			<div className='my-2 flex justify-end gap-2 mt-6'>
		// 				{/* <RatingInfo rating={product.current_rating} /> */}
		// 				<p>{product.current_rating} відгуків</p>
		// 			</div>
		// 			{/* VARIANTS */}
		// 			{/* <Variants
		// 				variantsProduct={product?.variant}
		// 				currentIndex={currentIndex}
		// 				setCurrentIndex={setCurrentIndex}
		// 				setAnimate={setAnimate}
		// 				// stock={stock}
		// 			/> */}
		// 			{/* SHOW PRODUCT IN CART */}
		// 			{itemInCart ? (
		// 				<p className='p-3 w-1/2 text-xl my-4 flex gap-4 justify-end items-center'>
		// 					<AiOutlineCheckSquare size={25} />
		// 					<span>Товар у кошику</span>
		// 				</p>
		// 			) : (
		// 				// PRODUCT WITHOUT IN CART
		// 				<button
		// 					className='bg-btnPrimary text-white p-3 w-1/2 text-xl my-4'
		// 					// disabled={!stock}
		// 					// onClick={() => addCartItem(userId, cartItem!)}
		// 				>
		// 					Add to cart
		// 				</button>
		// 			)}
		// 			{/* INFO BLOCK INFORMATION */}
		// 			<div className='text-justify'>
		// 				<p className='py-2'>
		// 					<b>description: </b>
		// 					{product.description}
		// 				</p>
		// 				<p className='py-2'>
		// 					<b>shelfLie: </b>
		// 					{product.shelfLife}
		// 				</p>
		// 				<p className='py-2'>
		// 					<b>specification: </b>
		// 					{product.specification}
		// 				</p>
		// 				<p className='py-2'>
		// 					<b>useTo: </b>
		// 					{product.useTo}
		// 				</p>
		// 			</div>
		// 		</div>
		// 	</div>
		// </section>
	)
}
