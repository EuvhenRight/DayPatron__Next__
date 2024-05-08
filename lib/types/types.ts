import { Prisma, User } from '@prisma/client'

export interface CartItem {
	id: string
	name: string
	image: string
	volume: string
	article: string
	discount_price: number
	original_price: number
	stock: boolean
	productId: string
	quantity: number
}

export interface Cart {
	id: string
	items: CartItem[]
	userId: string
	itemsTotal: number
	subTotal: number
}

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'email'> & {
	createdAt: string
	updatedAt: string
	email: string
}

export type ProductsWithVariants = Prisma.ProductGetPayload<{
	include: { variant: true }
}>
export type CartWithItems = Prisma.CartGetPayload<{
	include: { items: { include: { variant: true } } }
}>
