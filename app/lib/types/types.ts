export interface Product {
	image: {
		url: string
	}[]
	id: string
	linkName: string
	name: string
	UTP: string
	description: string
	useTo: string
	volume: string[]
	ingredients: string
	specification: string
	shelfLife: string
	category: string
	price: number
	stock: boolean
	current_rating: number
}
