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
import { useEffect, useState, useTransition } from 'react'
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
	const [pending, startTransition] = useTransition()

	//SERVER ACTION ADD TO CART
	const addItemToCart = async (variantId: string) => {
		let itemInCart: Promise<ProductsWithVariants>
		if (!variantId) {
			// TOAST ERROR
			toast.error('Щось пішло не так, спробуйте ще раз')
		}

		itemInCart = new Promise<ProductsWithVariants>(resolve => {
			// ADD TO CART
			// @ts-ignore TODO: fix type
			resolve(addItem(variantId!))
		})

		// TOAST SUCCESS
		await toast.promise(itemInCart, {
			loading: 'Зачекаємо...',
			success: 'Товар додано до кошика',
			error: 'Щось пішло не так, спробуйте ще раз',
		})

		return true
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
						<p className='p-2 w-1/2 text-lg my-2 flex gap-4 justify-end items-center'>
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
	)
}
