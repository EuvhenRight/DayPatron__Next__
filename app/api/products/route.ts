// app/api/products/route.ts
import prisma from '@/prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const items = await prisma.product.findMany()
		if (!items) {
			return NextResponse.json("Products don't found", { status: 404 })
		}
		return NextResponse.json({ items }, { status: 200 })
	} catch (error) {
		console.error('Error processing request:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
