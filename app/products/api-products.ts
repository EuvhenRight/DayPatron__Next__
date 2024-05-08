import { cache } from 'react'
export const getAllProducts = cache(async () => {
	try {
		const res = await fetch('http://localhost:3000/api/products')
		if (!res.ok) {
			throw new Error('Failed to fetch products')
		}
		return res.json()
	} catch (error) {
		console.error('Error fetching products:', error)
	}
})

export const getProduct = cache(async (id: string) => {
	try {
		const res = await fetch(`http://localhost:3000/api/products/${id}/details`)
		if (!res.ok) {
			throw new Error('Failed to fetch product')
		}

		return res.json()
	} catch (error) {
		console.error('Error fetching product:', error)
	}
})
