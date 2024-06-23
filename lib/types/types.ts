import { Prisma, User } from '@prisma/client'

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'email'> & {
	createdAt: string
	updatedAt: string
	email: string
}

export type ExtraUser = {
	email: string
	firstName: string
	lastName: string
	phone: string
}

export type ProductsWithVariants = Prisma.ProductGetPayload<{
	include: { variant: true }
}>

export type CartWithVariants = Prisma.CartGetPayload<{
	include: { items: { include: { variant: true } } }
}>

export type UserWithDeliveryItems = Prisma.UserGetPayload<{
	include: { address: { include: { items: true } } }
}>

export type UserWithOrderItems = Prisma.UserGetPayload<{
	include: { order: true }
}>

export type DeliveryWithItems = Prisma.DeliveryGetPayload<{
	include: { items: true }
}>

export type CartItemWithVariants = Prisma.CartItemGetPayload<{
	include: { variant: true }
}>

export type OrderWithItems = Prisma.OrderGetPayload<{
	include: { item: true }
}>
export type OrderForm = Prisma.OrderGetPayload<{
	include: {
		item: true
		address: true
		user: true
	}
}>

export type OrderFormInputs = {
	extra_user: ExtraUser
	payment: string
	comment: string
	address: string
	cartId: string
}

type OrderItem = {
	variantId: string
	quantity: number
}

// export type DeliveryItem = {
// 	typeOfDelivery: string
// 	branchNumber?: string
// 	city?: string
// 	street?: string
// 	houseNumber?: number
// 	additionNumber?: string
// 	apartmentNumber?: number
// 	zipCode?: string
// 	deliveryId: string
// }

export type OrderFormTest = Prisma.OrderCreateInput & {
	extra_user: ExtraUser
	payment: string
	items: OrderItem[]
	address: string
	user: User
}
