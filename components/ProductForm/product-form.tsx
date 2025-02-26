'use client'
import { BreadcrumbProduct } from '@/components/ProductForm/breadcrumb'
import { Variants } from '@/components/ProductForm/variants'
import type {
	CartItemWithVariants,
	CartWithVariants,
	ProductWithVariantsWithReviews,
} from '@/lib/types/types'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import 'react-medium-image-zoom/dist/styles.css'

import { addItem } from '@/actions/cart'
import { SliderWithProducts } from '@/components/ProductForm/slider-with-products'
import { ShareButton } from '@/components/Share/social-share'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import data from '@/lib/db/content.json'
import { rubikDirt } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { AiOutlineCheckSquare, AiOutlineShoppingCart } from 'react-icons/ai'
import { toast } from 'sonner'

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
	// FULL LINK
	const [fullLink, setFullLink] = useState<string>(``)
	const productContent = data.products.find(item => product.id === item.id)

	// ANIMATION
	const animateVariants = {
		offscreen: {
			y: 50,
			opacity: 0,
		},
		onscreen: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				bounce: 0.4,
				duration: 0.8,
			},
		},
	}

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

	useEffect(() => {
		// This code will run only on the client side
		if (typeof window !== 'undefined') {
			setFullLink(window.location.href)
		}
	}, [])

	return (
		<div className='flex lg:flex-row flex-col lg:justify-center relative'>
			<div className='lg:w-1/2 mt-0 md:mt-6 lg:-mt-12'>
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
			{/* Animation */}
			<motion.div
				initial='offscreen'
				whileInView='onscreen'
				variants={animateVariants}
				viewport={{ once: true, amount: 0.15 }}
				className='flex flex-col lg:w-1/2 justify-end items-end'
			>
				<div className='hidden lg:flex justify-end items-end'>
					<BreadcrumbProduct product={product} />
				</div>
				{/* NAME */}
				<div className='flex flex-row items-start lg:items-center gap-2 lg:px-0 my-1 lg:my-5'>
					<ShareButton />
					<h1
						className={cn(
							rubikDirt.className,
							'text-xl lg:text-3xl uppercase space-y-2 line-height-[1.5] text-center lg:text-end items-center lg:items-end'
						)}
					>
						{product.name}
					</h1>
				</div>
				{/* RATING */}
				<div
					className='my-1 lg:flex lg:justify-end gap-2 cursor-pointer lg:static'
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
						rating={product?.reviews?.ratingTotal!}
						totalStars={5}
						size={20}
						className='flex flex-col justify-end items-end'
						variant='yellow'
						showText={true}
						disabled={true}
						totalReviews={product?.reviews?.messageTotal!}
					/>
				</div>
				{/* VARIANTS */}
				<div className='flex items-end flex-col'>
					<Variants
						variantsProduct={product?.variant}
						currentIndex={currentIndex!}
						setCurrentIndex={setCurrentIndex}
						setAnimate={setAnimate}
						stock={stock}
					/>
				</div>
				{/* SHOW PRODUCT IN CART */}
				{itemInCart ? (
					<div className='p-2 text-lg my-2 gap-4 flex items-end flex-row-reverse'>
						<AiOutlineCheckSquare size={25} />
						<span>Товар у кошику</span>
					</div>
				) : (
					<Button
						variant={'destructive'}
						className='p-2 my-2 text-md hover:scale-105 transition-all ease-in-out duration-300 shadow-lg md:w-1/3 flex items-end'
						size='lg'
						disabled={!stock}
						onClick={() => {
							addItemToCart(product.variant[currentIndex!].id)
						}}
					>
						<AiOutlineShoppingCart size={25} className='mr-2' />
						КУПИТИ
					</Button>
				)}
				{/* INFO BLOCK INFORMATION  */}
				<div className='text-justify px-2 lg:px-0'>
					<article className='py-2'>{productContent?.description}</article>
					<ul className='py-2 lg:pl-4 list-disc ml-5'>
						{productContent?.properties.map((property, index) => (
							<li key={index} className='py-2'>
								<span className='font-extrabold mr-2 text-lg text-start lg:text-justify'>
									{property.title}
								</span>
								{property.text}
							</li>
						))}
					</ul>
					<ul className='pb-2 lg:pl-4 list-disc ml-5'>
						<li className='py-1'>
							<b>Термін зберігання: </b>
							{productContent?.shelfLife}
						</li>
						<li className='py-1'>
							<b>Склад: </b>
							{productContent?.ingredients}
						</li>
						<li className='py-1'>
							<Accordion type='single' collapsible>
								<AccordionItem value='item-1'>
									<AccordionTrigger className='p-2 snap-center font-bold'>
										Інструкція з використання:
									</AccordionTrigger>
									<AccordionContent className='mt-2 text-base'>
										{productContent?.howToUse}
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</li>
					</ul>
				</div>
			</motion.div>
		</div>
	)
}
