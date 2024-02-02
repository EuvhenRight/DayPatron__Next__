'use client'

import { useTransition } from 'react'

interface Props {
	products: any
	incrementProductQuantity: any
}
export function Card({ products, incrementProductQuantity }: Props) {
	const [isPanging, startTransition] = useTransition()
	return (
		<div className='container'>
			<h1>{products[0].name}</h1>
			<p>{products[0].price}</p>
			<button
				onClick={() => {
					startTransition(async () => {
						await incrementProductQuantity(products[0].id)
					})
				}}
			>
				Add to cart
			</button>
		</div>
	)
}
