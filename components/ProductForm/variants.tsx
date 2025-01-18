'use client'
import { PriceTag } from '@/components/PriceTag'
import { rubikDirt } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Variant } from '@prisma/client'
import React from 'react'

interface Props {
	variantsProduct: Variant[]
	currentIndex: number
	setCurrentIndex: React.Dispatch<React.SetStateAction<number | null>>
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>
	stock: boolean
}
export const Variants = ({
	variantsProduct,
	currentIndex,
	setCurrentIndex,
	setAnimate,
	stock,
}: Props) => {
	const handleVolumeClick = (index: number) => {
		if (currentIndex !== index) {
			setAnimate(true)
			setCurrentIndex(index)
		}
	}
	const handleContainerBlur = (e: React.FocusEvent<HTMLUListElement>) => {
		// Check if the new focused element is outside the current container
		if (!e.currentTarget.contains(e.relatedTarget)) {
			setCurrentIndex(currentIndex) // Clear the current index
		}
	}
	// DISCOUNT
	const discountPrice = variantsProduct[currentIndex]?.discount_price

	return (
		<>
			{/* PRICE */}
			{currentIndex !== null ? (
				<div
					className={cn(
						rubikDirt.className,
						'flex gap-2 items-center my-3 text-4xl font-bold'
					)}
				>
					<p className={discountPrice > 0 ? 'line-through' : ''}>
						{<PriceTag price={variantsProduct[currentIndex]?.original_price} />}
					</p>
					{/* DISCOUNT ON/OFF */}
					{discountPrice > 0 ? (
						<p className='text-red-500 font-bold animate-bounce'>
							{
								<PriceTag
									price={variantsProduct[currentIndex]?.discount_price}
								/>
							}
						</p>
					) : null}
				</div>
			) : (
				<div className='my-1 lg:my-4 text-sm lg:text-lg'>
					Будь ласка, виберіть об&apos;єм мл.
				</div>
			)}
			{/* VOLUME */}
			<ul className='flex gap-5 items-center my-2' onBlur={handleContainerBlur}>
				Об&apos;єм:
				{variantsProduct.map((variant, index) => {
					return (
						<li
							// FOCUS VOLUME BUTTON
							className={cn(
								rubikDirt.className,
								currentIndex === index
									? 'cursor-pointer rounded-md border-[3px] border-black px-2 py-1 snap-center text-sm lg:text-lg shadow-lg active:scale-95'
									: 'cursor-pointer rounded-md border border-gray-600 px-2 py-1 snap-center text-sm lg:text-lg shadow-lg'
							)}
							key={index}
							tabIndex={0}
							onClick={() => handleVolumeClick(index)}
						>
							{variant.volume}
						</li>
					)
				})}
			</ul>
			{/* STOCK VALUE */}
			<div>
				{stock ? (
					<div className='flex gap-5 items-center my-4'>
						<span className='relative flex h-3 w-3'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75'></span>
							<span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
						</span>
						<span>Є в наявності</span>
					</div>
				) : (
					<div className='flex gap-5 items-center my-1 lg:my-4'>
						<span className='relative flex h-3 w-3'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-btnPrimary opacity-75'></span>
							<span className='relative inline-flex rounded-full h-3 w-3 bg-btnPrimary'></span>
						</span>
						<span className='text-sm lg:text:lg'>Недоступно</span>
					</div>
				)}
			</div>
			{/* {currentIndex !== null ? (
				<p className='mb-4'>
					артикул: {variantsProduct[currentIndex]?.article}
				</p>
			) : (
				<p className='mb-4'>article: ----</p>
			)} */}
		</>
	)
}
