import prisma from '@/lib/db/client'
import { cartValidationSchema } from '@/lib/db/validation'
import { Product } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
	request: NextRequest,
	{ params: { userId } }: { params: { userId: string } }
) {
	try {
		const product: Product = await request.json()

		//	CHECK VALIDATION
		const validatedBody = cartValidationSchema.safeParse(product)
		if (!validatedBody.success) {
			return NextResponse.json(validatedBody.error.errors, { status: 400 })
		}

		if (!product) {
			return NextResponse.json(
				{ error: 'Invalid product in cart' },
				{ status: 400 }
			)
		}

		// FIND EXISTING CART
		let cart = await prisma.cart.findUnique({
			where: { userId },
			include: { items: true },
		})

		if (!cart) {
			cart = await prisma.cart.create({
				data: {
					userId,
					items: { create: [] },
					subTotal: 0,
					itemsTotal: 0,
				},
				include: { items: { include: { product: true } } },
			})
		}

		// FIND EXISTING CART ITEM
		const existingCartItem = cart.items.find(
			item => item.productId === product.id
		)

		// UPDATE CART ITEM
		let cartItem
		if (existingCartItem) {
			cartItem = await prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: { quantity: { increment: 1 } },
			})
		} else {
			cartItem = await prisma.cartItem.create({
				data: {
					name: product.name,
					article: product.article,
					volume: product.volume,
					original_price: product.original_price,
					discount_price: product.discount_price,
					productId: product.id,
					quantity: 1,
					cartId: cart.id,
				},
			})
		}

		// FIND NEW CART
		const newCart = await prisma.cart.findUnique({
			where: { userId },
			include: { items: true },
		})

		// RECALCULATE TOTALS
		const totalPrice = newCart?.items.reduce((acc, item) => {
			const price =
				item.discount_price !== 0 ? item.discount_price : item.original_price
			return acc + price * item.quantity
		}, 0)

		const totalItems = newCart?.items.reduce(
			(acc, item) => acc + item.quantity,
			0
		)

		// UPDATE CART
		await prisma.cart.update({
			where: { userId },
			data: { subTotal: totalPrice, itemsTotal: totalItems },
		})

		return NextResponse.json({ newCart, cartItem }, { status: 200 })
	} catch (error: any) {
		console.error('Error adding item to cart:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	} finally {
		await prisma.$disconnect() // DISCONNECT FROM DATABASE
	}
}