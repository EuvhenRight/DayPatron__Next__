'use client'

import { PriceTag } from '@/components/PriceTag'
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
	const handleContainerBlur = () => {
		setCurrentIndex(currentIndex)
	}
	// DISCOUNT
	const discountPrice = variantsProduct[currentIndex]?.discount_price

	return (
		<>
			{/* PRICE */}
			{currentIndex !== null ? (
				<div className='flex gap-2 items-center my-6 text-xl'>
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
				<div className='my-6 text-xl'>Please choose a SIZE</div>
			)}
			{/* VOLUME */}
			<ul className='flex gap-5 items-center my-2' onBlur={handleContainerBlur}>
				SIZE:
				{variantsProduct.map((variant, index) => {
					return (
						<li
							// FOCUS VOLUME BUTTON
							className='cursor-pointer rounded-md border border-gray-600 px-2 py-1 snap-center text-lg focus:ring-2 focus:ring-current focus:outline-none'
							key={index}
							tabIndex={0}
							onClick={() => handleVolumeClick(index)}
							onBlur={e => {
								// only re-focus if the user clicked on something
								// that was NOT an input element
								if (e.relatedTarget === null) {
									e.target.focus()
								}
							}}
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
						<span>In stock, ready to ship</span>
					</div>
				) : (
					<div className='flex gap-5 items-center my-4'>
						<span className='relative flex h-3 w-3'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-btnPrimary opacity-75'></span>
							<span className='relative inline-flex rounded-full h-3 w-3 bg-btnPrimary'></span>
						</span>
						<span>Out of stock</span>
					</div>
				)}
			</div>
			{currentIndex !== null ? (
				<p className='mb-4'>
					article: {variantsProduct[currentIndex]?.article}
				</p>
			) : (
				<p className='mb-4'>article: ----</p>
			)}
		</>
	)
}
