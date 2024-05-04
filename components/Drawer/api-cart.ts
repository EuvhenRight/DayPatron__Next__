export const getCart = async (userId: string) => {
	try {
		const res = await fetch(`http://localhost:3000/api/cart/${userId}/get`)
		if (!res.ok) {
			throw new Error('Failed to fetch products')
		}
		return res.json()
	} catch (error) {
		console.error('Error fetching products:', error)
	}
}
