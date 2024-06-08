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
	phone: string
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
		email: z.string().email({ message: 'Невірна адреса електронної пошти' }),
	}) as ZodSchema<AuthUserSchema>,
	// LOGIN
	loginUser: z.object({
		email: z.string().email({ message: 'Невірна адреса електронної пошти' }),
		password: z.string().length(6),
	}) as ZodSchema<LoginUserSchema>,
	// PROFILE
	profileUser: z.object({
		email: z.any(),
		firstName: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.regex(/^[\u0400-\u04FF]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів')
			.nullable(),
		lastName: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.regex(/^[\u0400-\u04FF]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів')
			.nullable(),
		phone: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.min(13, 'Невірний номер телефону'),
	}) as ZodSchema<ProfileUserSchema>,
	// EXTRA USER
	extraUser: z.object({
		email: z
			.string({ required_error: "Це поле є обов'язковим" })
			.email({ message: 'Невірна адреса електронної пошти' }),
		firstName: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.regex(/^[\u0400-\u04FF]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів')
			.nullable(),
		lastName: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.regex(/^[\u0400-\u04FF]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів')
			.nullable(),
		phone: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.min(13, 'Невірний номер телефону'),
	}) as ZodSchema<ProfileUserSchema>,
	// DELIVERY
	deliveryAddress: z.object({
		typeOfDelivery: z
			.string({ required_error: "Це поле є обов'язковим" })
			.min(3, 'Виберіть тип доставки'),
		city: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.regex(/^[\u0400-\u04FF]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів'),
		street: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.regex(/^[\u0400-\u04FF]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів'),
		houseNumber: z
			.number({ invalid_type_error: "Це поле є обов'язковим" })
			.nonnegative({ message: "Не може бути від'ємним" })
			.nullable(),
		apartmentNumber: z
			.number({ invalid_type_error: "Це поле є обов'язковим" })
			.nonnegative({ message: "Не може бути від'ємним" })
			.nullable(),
		additionNumber: z.string().nullable().optional(),
		zipCode: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів'),
	}) as ZodSchema<DeliveryAddress>,
	// DELIVERY BRANCH
	deliveryBranch: z.object({
		typeOfDelivery: z
			.string({ required_error: "Це поле є обов'язковим" })
			.min(3, 'Bиберіть тип доставки'),
		branchNumber: z
			.string({ invalid_type_error: "Це поле є обов'язковим" })
			.min(1, 'Має містити 1 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів'),
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
		.min(1, 'Кількість має бути більше або дорівнювати 1')
		.max(99, 'Кількість має бути менше або дорівнювати 99'),
})
