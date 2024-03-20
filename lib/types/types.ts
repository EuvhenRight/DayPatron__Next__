import { User } from '@prisma/client'

export interface Product {
	id: string
	linkName: string
	name: string
	UTP: string
	NEW: boolean
	HIT: boolean
	description: string
	useTo: string
	image: Image[]
	ingredients: string
	specification: string
	shelfLife: string
	category: string
	variants: Variant[]
	current_rating: number
	cartItem?: CartItem[]
	tradeMarkImage: string
	min_price: number | null // Use "?" for optional properties
}

export interface Image {
	url: string
}

export interface Variant {
	volume: string
	article: string
	stock: boolean
	image: string
	discount_price: number // Assuming these prices are in numbers
	original_price: number
}

export interface CartItem {
	id: string
	quantity: number
	productId: string
	cartId: string
	product: Product // Include the product property in the CartItem type
}

export type ProductInCart = {
	id: string
	name: string
	volume: string
	image: string
	quantity: number
	article: string
	discount_price?: number
	original_price: number
}

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'email'> & {
	createdAt: string
	updatedAt: string
	email: string
}
