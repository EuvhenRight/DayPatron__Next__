import prisma from '@/lib/db/client'
import { cartValidationSchema } from '@/lib/db/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
	request: NextRequest,
	{ params: { userId } }: { params: { userId: string } }
) {
	try {
		const { id, quantity } = await request.json()

		const validatedBody = cartValidationSchema.safeParse({
			quantity,
		})
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}

		const cart = await prisma.cart.findUnique({
			where: { userId },
			include: { items: true },
		})

		if (!cart) {
			return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
		}

		const findItem = cart.items.find(item => item.id === id)

		if (!findItem) {
			return NextResponse.json(
				{ error: 'Cart item not found' },
				{ status: 404 }
			)
		}

		const newCartItemValue = await prisma.cartItem.update({
			where: { id: findItem.id },
			data: { quantity: quantity },
		})

		const newCart = await prisma.cart.findUnique({
			where: { userId },
			include: { items: true },
		})

		const totalPrice = newCart?.items.reduce((acc, item) => {
			const price =
				item.discount_price !== 0 ? item.discount_price : item.original_price
			return acc + price * item.quantity
		}, 0)

		const totalItems = newCart?.items.reduce(
			(acc, item) => acc + item.quantity,
			0
		)

		const updatedCart = await prisma.cart.update({
			where: { userId },
			data: { subTotal: totalPrice, itemsTotal: totalItems },
		})

		return NextResponse.json(
			{ cart: updatedCart, cartItem: newCartItemValue },
			{ status: 200 }
		)
	} catch (error: any) {
		console.error('Error updating cart item:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
