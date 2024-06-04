import { Prisma, User } from '@prisma/client'

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'email'> & {
	createdAt: string
	updatedAt: string
	email: string
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
