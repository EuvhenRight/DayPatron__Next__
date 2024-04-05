// pages/api/cart/[cartId]/items.ts
import prisma from '@/lib/db/client'
import { Product } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
	request: NextRequest,
	{ params: { userId } }: { params: { userId: string } }
) {
	try {
		// Parse the request body as JSON
		const body = await request.text()
		const requestBody = JSON.parse(body)

		const product: Product = requestBody

		// Validation check for productId and quantity
		if (!product) {
			return NextResponse.json(
				{ error: 'Invalid product in cart' },
				{ status: 400 }
			)
		}

		const cart = await prisma.cart.findUnique({
			where: { itemsTotal: 0 },
			include: { items: { include: { product: true } } },
		})

		const newCart =
			cart ??
			(await prisma.cart.create({
				data: { userId, items: { create: [] }, subTotal: 0, itemsTotal: 0 },
				include: { items: { include: { product: true } } },
			}))
		console.log(newCart, 'newCart')
		console.log(cart, 'cart')
		const existingCartItem = cart?.items.find(
			item => item.product.id === product.id
		)

		if (existingCartItem) {
			// If the product exists, update the quantity
			const updatedCartItem = await prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: {
					quantity: {
						increment: 1,
					},
				},
			})
			return NextResponse.json({ CartItem: updatedCartItem }, { status: 200 })
		} else {
			// If the product doesn't exist, create a new cart item
			const newCartItem = await prisma.cartItem.create({
				data: {
					productId: product.id,
					quantity: 1,
					cartId: newCart.id,
				},
			})
			return NextResponse.json({ cartItem: newCartItem }, { status: 200 })
		}
	} catch (error: any) {
		console.error('Error adding item to cart:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	} finally {
		await prisma.$disconnect() // Disconnect from the Prisma client after executing the query
	}
}
