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

export type CartItemWithVariants = Prisma.CartItemGetPayload<{
	include: { variant: true }
}>
