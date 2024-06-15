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

type AddressInput = {
	id: string
	typeOfDelivery: string
	branchNumber: string | null
	city: string | null
	street: string | null
	houseNumber: number | null
	apartmentNumber: number | null
	additionNumber: string | null
	zipCode: string | null
	deliveryId: string
}

export type OrderFormInputs = {
	extra_user: ExtraUser
	payment: string
	comment: string
	address: AddressInput
	cartId: string | undefined
}
