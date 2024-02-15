'use client'
import { Variant } from '@/app/lib/types/types'
import React, { useState } from 'react'

interface VariantsProps {
	variants: Variant[]
}

const Variants: React.FC<VariantsProps> = ({ variants }: VariantsProps) => {
	const [currentIndex, setCurrentIndex] = useState(0)

	const handleVolumeClick = (index: number) => {
		setCurrentIndex(index)
	}

	const stock = variants[currentIndex].stock

	const discountPrice = variants[currentIndex].discount_price
	return (
		<>
			{/* VOLUME */}
			<div>
				{variants.map((variant, index) => {
					return (
						<div key={index} onClick={() => handleVolumeClick(index)}>
							{variant.volume}
						</div>
					)
				})}
			</div>
			{/* STOCK VALUE */}
			<div>
				{stock ? (
					<div className='flex gap-5 items-center'>
						<span className='relative flex h-3 w-3'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75'></span>
							<span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
						</span>
						<span>In stock, ready to ship</span>
					</div>
				) : (
					<div className='flex gap-5 items-center'>
						<span className='relative flex h-3 w-3'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-btnPrimary opacity-75'></span>
							<span className='relative inline-flex rounded-full h-3 w-3 bg-btnPrimary'></span>
						</span>
						<span>Out of stock</span>
					</div>
				)}
			</div>
			<p>{variants[currentIndex].article}</p>
			{/* PRICE */}
			<div className='flex gap-2 items-center'>
				<p className={discountPrice > 0 ? 'line-through' : ''}>
					{variants[currentIndex].original_price}
				</p>
				{discountPrice > 0 ? (
					<p className='text-btnPrimary bold'>
						{variants[currentIndex].discount_price}
					</p>
				) : null}
			</div>
		</>
	)
}

export default Variants
