import { cache } from 'react'

export const getCart = cache(async (userId: string) => {
	try {
		const res = await fetch(`http://localhost:3000/api/cart/${userId}/get`, {
			method: 'GET',
		})
		if (!res.ok) {
			throw new Error('Failed to fetch products')
		}

		return res.json()
	} catch (error) {
		console.error('Error fetching products:', error)
	}
})

export const deleteItem = cache(async (userId: string, itemId: string) => {
	try {
		const res = await fetch(`http://localhost:3000/api/cart/${userId}/delete`, {
			method: 'DELETE',
			body: JSON.stringify({ itemId }),
		})

		if (!res.ok) {
			throw new Error('Failed to delete item')
		}
		return res.statusText === 'success'
	} catch (error) {
		console.error('Error deleting item:', error)
		throw new Error('Error deleting item')
	}
})
