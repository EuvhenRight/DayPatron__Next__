// // pages/api/cart/[cartId]/items.ts
// import prisma from '@/lib/db/client'
// import { NextRequest, NextResponse } from 'next/server'

// export async function GET(
// 	request: NextRequest,
// 	{ params: { userId } }: { params: { userId: string } }
// ) {
// 	try {
// 		const cart = await prisma.cart.findUnique({
// 			where: { userId },
// 			include: { items: true },
// 		})

// 		return NextResponse.json(cart, { status: 200 })
// 	} catch (error) {
// 		console.error('Error adding item to cart:', error)
// 		return NextResponse.json(
// 			{ error: 'Internal Server Error' },
// 			{ status: 500 }
// 		)
// 	}
// }
