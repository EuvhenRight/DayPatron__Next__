import { z } from 'zod'

export const ValidationSchema = {
	authUser: z.object({
		email: z.string().email({ message: 'Invalid email address' }),
	}),
	newProductSchema: z.object({
		article: z.number(),
		linkName: z.string(),
		name: z.string(),
		UTP: z.string(),
		description: z.string(),
		useTo: z.string(),
		image: z.array(z.object({ url: z.string() })),
		volume: z.array(z.string()),
		ingredients: z.string(),
		shelfLife: z.string(),
		category: z.string(),
		price: z.number(),
		specification: z.string(),
		stock: z.boolean(),
		current_rating: z.number().optional(),
		productInCart: z.string().optional(),
		productInCartId: z.string().optional(),
	}),
}
