import { ZodSchema, z } from 'zod'

export interface AuthUserSchema {
	email: string
}

export interface CartSchema {
	quantity: number
}

export interface LoginUserSchema {
	email: string
	password: string
}

export interface ProfileUserSchema {
	firstName: string
	lastName: string
	email: string
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
		email: z.any(),
		firstName: z
			.string()
			.min(3, 'має містити 3 або більше елементів')
			.nullable(),
		lastName: z
			.string()
			.min(3, 'має містити 3 або більше елементів')
			.nullable(),
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

export const cartValidationSchema = z.object({
	quantity: z
		.number()
		.min(1, 'Quantity must be greater than or equal to 1')
		.max(99, 'Quantity must be less than or equal to 99'),
})
