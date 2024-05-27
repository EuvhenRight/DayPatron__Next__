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

export interface DeliveryAddress {
	typeOfDelivery: string
	city: string
	street: string
	houseNumber: number
	apartmentNumber: number
	additionNumber: string
	zipCode: string
}
export interface DeliveryBranch {
	typeOfDelivery: string
	branchNumber: string
}

export const ValidationSchema = {
	// AUTH
	authUser: z.object({
		email: z.string().email({ message: 'Invalid email address' }),
	}) as ZodSchema<AuthUserSchema>,
	// LOGIN
	loginUser: z.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string().length(6),
	}) as ZodSchema<LoginUserSchema>,
	// PROFILE
	profileUser: z.object({
		email: z.any(),
		firstName: z
			.string({ invalid_type_error: "це поле є обов'язковим" })
			.min(3, 'має містити 3 або більше елементів')
			.max(50, 'має містити 50 або менше елементів')
			.nullable(),
		lastName: z
			.string({ invalid_type_error: "це поле є обов'язковим" })
			.min(3, 'має містити 3 або більше елементів')
			.max(50, 'має містити 50 або менше елементів')
			.nullable(),
	}) as ZodSchema<ProfileUserSchema>,
	// DELIVERY
	deliveryAddress: z.object({
		typeOfDelivery: z
			.string({ required_error: "це поле є обов'язковим" })
			.min(3, 'виберіть тип доставки'),
		city: z
			.string({ invalid_type_error: "це поле є обов'язковим" })
			.min(3, 'має містити 3 або більше елементів')
			.max(50, 'має містити 50 або менше елементів'),
		street: z
			.string({ invalid_type_error: "це поле є обов'язковим" })
			.min(3, 'має містити 3 або більше елементів')
			.max(50, 'має містити 50 або менше елементів'),
		houseNumber: z
			.number({ invalid_type_error: "це поле є обов'язковим" })
			.nonnegative({ message: 'не може бути відємним' })
			.nullable(),
		apartmentNumber: z
			.number({ invalid_type_error: "це поле є обов'язковим" })
			.nonnegative({ message: 'не може бути відємним' })
			.nullable(),
		additionNumber: z.string().nullable().optional(),
		zipCode: z
			.string({ invalid_type_error: "це поле є обов'язковим" })
			.min(3, 'має містити 3 або більше елементів')
			.max(50, 'має містити 50 або менше елементів'),
	}) as ZodSchema<DeliveryAddress>,
	// DELIVERY BRANCH
	deliveryBranch: z.object({
		typeOfDelivery: z
			.string({ required_error: "це поле є обов'язковим" })
			.min(3, 'виберіть тип доставки'),
		branchNumber: z
			.string({ invalid_type_error: "це поле є обов'язковим" })
			.min(1, 'має містити 1 або більше елементів')
			.max(50, 'має містити 50 або менше елементів'),
	}),
	// PRODUCT
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
// TODO: FIX VALIDATION CART
export const cartValidationSchema = z.object({
	quantity: z
		.number()
		.min(1, 'Quantity must be greater than or equal to 1')
		.max(99, 'Quantity must be less than or equal to 99'),
})
