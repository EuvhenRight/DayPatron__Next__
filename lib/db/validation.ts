import { ZodSchema, z } from 'zod'

export interface AuthUserSchema {
	email: string
}

interface LoginUserSchema {
	email: string
	password: string
}

interface ProfileUserSchema {
	name: string
	lastName: string
}

export const ValidationSchema = {
	authUser: z.object({
		email: z
			.string()
			.nonempty('This field is required')
			.email({ message: 'Invalid email address' }),
	}) as ZodSchema<AuthUserSchema>,
	loginUser: z.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string().length(6),
	}) as ZodSchema<LoginUserSchema>,
	profileUser: z.object({
		name: z.string().min(3, 'must contain 3 or more items').nullable(),
		lastName: z.string().min(3, 'must contain 3 or more items').nullable(),
	}) as ZodSchema<ProfileUserSchema>,
	newProductSchema: z.object({
		linkName: z.string(),
		name: z.string(),
		UTP: z.string(),
		description: z.string(),
		useTo: z.string(),
		image: z.array(z.object({ url: z.string() })),
		ingredients: z.string(),
		shelfLife: z.string(),
		category: z.string(),
		variants: z.array(
			z.object({
				name: z.string(),
				price: z.number(),
				specification: z.string(),
				stock: z.boolean(),
				current_rating: z.number().optional(),
			})
		),
		price: z.number(),
		specification: z.string(),
		current_rating: z.number().optional(),
		mim_price: z.number(),
	}),
}
