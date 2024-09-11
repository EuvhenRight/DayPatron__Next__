'use server'

import prisma from '@/lib/db/client'

export async function getSearch(searchQuery: string) {
	try {
		const search = await prisma.product.findMany({
			where: {
				OR: [
					{
						name: {
							contains: searchQuery,
							mode: 'insensitive',
						},
					},
					{
						description: {
							contains: searchQuery,
							mode: 'insensitive',
						},
					},
				],
			},
		})
		return search
	} catch (error) {
		console.error('Error fetching reviews:', error)
	}
}
