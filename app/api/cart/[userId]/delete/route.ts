import prisma from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
	request: NextRequest,
	{ params: { userId } }: { params: { userId: string } }
) {
	try {
		const response = await request.json()

		const cart = await prisma.cart.findUnique({
			where: { userId },
		})

		if (!cart) {
			return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
		}

		const deleteItem = await prisma.cartItem.delete({
			where: { id: response.id },
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
			{ message: 'Cart item deleted successfully' },
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
