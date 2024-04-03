// pages/api/cart/[cartId]/items.ts

import { ProductInCart } from '@/lib/types/types'
import prisma from '@/lib/db/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
	request: NextRequest,
	{ params: { userId } }: { params: { userId: string } }
) {
	try {
		// Parse the request body as JSON
		const body = await request.text()
		const requestBody = JSON.parse(body)

		const product: ProductInCart = requestBody

		// Validation check for productId and quantity
		if (!product) {
			return NextResponse.json(
				{ error: 'Invalid product in cart' },
				{ status: 400 }
			)
		}

		let cart = await prisma.cart.findFirst({
			where: { userId },
			include: { items: true },
		})

		if (!cart) {
			cart = await prisma.cart.create({
				data: { userId, subTotal: 0, totalItems: 0 },
				include: { items: { include: { product: true } } },
			})
		}

		const foundCartItem = cart.items.find(
			item => item.productId === product.productId
		)

		if (foundCartItem) {
			const updatedCartItem = await prisma.cartItem.update({
				where: { id: foundCartItem.id },
				data: {
					quantity: foundCartItem.quantity + product.quantity,
				},
			})
			return NextResponse.json({ cartItem: updatedCartItem }, { status: 200 })
		} else {
			const cartItem = await prisma.cartItem.create({
				data: {
					...product,
					cartId: cart.id,
				},
			})
			return NextResponse.json({ cartItem }, { status: 200 })
		}
	} catch (error: any) {
		console.error('Error adding item to cart:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
