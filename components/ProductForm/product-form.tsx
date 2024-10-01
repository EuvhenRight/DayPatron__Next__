'use client'
import { BreadcrumbProduct } from '@/components/ProductForm/breadcrumb'
import { Variants } from '@/components/ProductForm/variants'
import type {
	CartItemWithVariants,
	CartWithVariants,
	ProductWithVariantsWithReviews,
} from '@/lib/types/types'
import { useEffect, useState } from 'react'
import 'react-medium-image-zoom/dist/styles.css'

import { addItem } from '@/actions/cart'
import { SliderWithProducts } from '@/components/ProductForm/slider-with-products'
import { Button } from '@/components/ui/button'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { AiOutlineCheckSquare } from 'react-icons/ai'
import { toast } from 'sonner'
import { Rating } from '../ui/rating'

interface Props {
	product: ProductWithVariantsWithReviews
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
	const [itemInCart, setItemInCart] = useState<CartItemWithVariants | null>(
		null
	)

	//SERVER ACTION ADD TO CART
	const addItemToCart = async (variantId: string): Promise<boolean> => {
		if (!variantId) {
			toast.error('Щось пішло не так, спробуйте ще раз')
			return false
		}

		try {
			await toast.promise(addItem(variantId), {
				loading: 'Зачекаємо...',
				success: 'Товар додано до кошика',
				error: 'Щось пішло не так, спробуйте ще раз',
			})
			return true
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: 'Щось пішло не так, спробуйте ще раз'
			toast.error(errorMessage)
			return false
		}
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
				<h1
					className={cn(
						rubikGlitch.className,
						'text-xl md:text-2xl lg:text-3xl font-bold uppercase space-y-2 line-height-[1.5] text-center lg:text-end my-1 lg:my-5 mt-0'
					)}
				>
					{product.name}
				</h1>
				<p className='font-bold italic my-2 text-center'>{product.UTP}</p>
				<div
					className='my-4 flex justify-end gap-2 mt-6 cursor-pointer'
					// NAVIGATE TO REVIEWS
					onClick={() => {
						document.getElementById(`reviews`)?.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
							inline: 'nearest',
						})
					}}
				>
					<Rating
						rating={product.reviews.ratingTotal}
						totalStars={5}
						size={32}
						className='flex flex-col justify-center items-end'
						variant='yellow'
						showText={true}
						disabled={true}
						totalReviews={product.reviews.messageTotal}
					/>
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
					<p className='p-2 w-1/2 text-lg my-2 flex gap-4 justify-end items-center'>
						<AiOutlineCheckSquare size={25} />
						<span>Товар у кошику</span>
					</p>
				) : (
					<Button
						variant={'destructive'}
						className='p-2 my-2 text-lg hover:scale-105 transition-all ease-in-out duration-300 shadow-lg'
						size='lg'
						disabled={!stock}
						onClick={() => {
							addItemToCart(product.variant[currentIndex!].id)
						}}
					>
						Додати до кошика
					</Button>
				)}

				{/* INFO BLOCK INFORMATION */}
				<div className='text-justify'>
					<article className='py-2'>{product.description}</article>
					<article className='py-2'>
						<b>строк зберігання: </b>
						{product.shelfLife}
					</article>
					<article className='py-2'>
						<b>склад: </b>
						{product.ingredients}
					</article>
					<article className='py-2'>
						<b>використання: </b>
						{product.useTo}
					</article>
				</div>
			</div>
		</div>
	)
}
