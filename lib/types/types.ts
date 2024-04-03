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

export type Image = {
	url: string
}

export type Variant = {
	volume: string
	article: string
	stock: boolean
	image: string
	discount_price: number // Assuming these prices are in numbers
	original_price: number
}

export interface CartItem {
	article: String
	discount_price: number
	image: String
	name: String
	original_price: number
	quantity: number
	volume: String
	productId: String
	cartId: String
}

export interface ProductInCart {
	productId: string
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
