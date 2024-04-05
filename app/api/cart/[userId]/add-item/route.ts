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
		const product: Product = await request.json()

		// Validation check for productId and quantity
		if (!product) {
			return NextResponse.json(
				{ error: 'Invalid product in cart' },
				{ status: 400 }
			)
		}

		// Find the cart for the user
		const cart = await prisma.cart.findUnique({
			where: { userId },
			include: { items: true },
		})

		// Calculate total price and total items
		const totalPrice =
			cart?.items.reduce((acc, item) => {
				const price =
					item.discount_price !== 0 ? item.discount_price : item.original_price
				return acc + price * item.quantity
			}, 0) || 0

		const totalItems =
			cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0

		// Create or update the cart
		const newCart =
			cart ??
			(await prisma.cart.create({
				data: {
					userId,
					items: { create: [] },
					subTotal: totalPrice,
					itemsTotal: totalItems,
				},
				include: { items: { include: { product: true } } },
			}))

		// Update cart totals if the cart already existed
		if (cart) {
			await prisma.cart.update({
				where: { userId },
				data: {
					subTotal: totalPrice,
					itemsTotal: totalItems,
				},
			})
		}

		// Find existing cart item
		const existingCartItem = cart?.items.find(
			item => item.productId === product.id
		)

		if (existingCartItem) {
			// If the product exists, update the quantity
			const updatedCartItem = await prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: { quantity: { increment: 1 } },
			})

			return NextResponse.json(
				{ cart: newCart, cartItem: updatedCartItem },
				{ status: 200 }
			)
		} else {
			// If the product doesn't exist, create a new cart item
			const newCartItem = await prisma.cartItem.create({
				data: {
					name: product.name,
					article: product.article,
					volume: product.volume,
					original_price: product.original_price,
					discount_price: product.discount_price,
					productId: product.id,
					quantity: 1,
					cartId: newCart.id,
				},
			})

			return NextResponse.json(
				{ cart: newCart, cartItem: newCartItem },
				{ status: 200 }
			)
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
