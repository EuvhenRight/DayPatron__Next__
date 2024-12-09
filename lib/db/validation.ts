import { Payment } from '@prisma/client'
import { ZodSchema, any, z } from 'zod'

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
	city: string
}
export interface ExtraUser {
	firstName: string
	lastName: string
	email: string
	phone: string
}

export interface OrderFormSchema {
	profile: ProfileUserSchema
	extra_user: ExtraUser
	payment: Payment
	comment: string
	address: string
	cartId: string
}

export interface FeedbackFormSchema {
	name: string
	email: string
	phone: string
	message: string
}

export interface ReviewsFormSchema {
	fullName: string
	email: string
	message: string
	rating: number
}

export interface SearchInputSchema {
	inputData: string
}

export interface BonusCodeFormSchema {
	bonusCodeInput: string
}

export const ValidationSchema = {
	// AUTH
	authUser: z.object({
		email: z.string().email({ message: 'Невірна адреса електронної пошти' }),
	}) as ZodSchema<AuthUserSchema>,
	// LOGIN
	loginUser: z.object({
		email: z.string().email({ message: 'Невірна адреса електронної пошти' }),
		password: z.string().length(6, { message: 'Невірний пароль' }),
	}) as ZodSchema<LoginUserSchema>,
	// PROFILE
	profileUser: z.object({
		email: z.any(),
		firstName: z
			.string({ invalid_type_error: "Поле 'Ім'я є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(20, 'Має містити 20 або менше елементів')
			.nullable(),
		lastName: z
			.string({ invalid_type_error: "Поле Прізвище є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(20, 'Має містити 20 або менше елементів')
			.nullable(),
		phone: z
			.string({ invalid_type_error: "Поле телефон є обов'язковим" })
			.min(13, 'Невірний номер телефону'),
	}) as ZodSchema<ProfileUserSchema>,
	// REVIEWS
	reviews: z
		.object({
			fullName: z
				.string({ invalid_type_error: "Поле 'Ім'я є обов'язковим" })
				.min(3, 'Має містити 3 або більше елементів')
				.max(20, 'Має містити 20 або менше елементів'),
			email: z.string().email({ message: 'Невірна адреса електронної пошти' }),
			rating: z
				.number({ invalid_type_error: "Поле рейтинг є обов'язковим" })
				.min(1, "Поле рейтинг є обов'язковим"),
			message: z
				.string({ invalid_type_error: "Поле повідомлення є обов'язковим" })
				.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
					message: 'Використовуйте тільки кириличні символи',
				})
				.min(20, 'Має містити 3 або більше елементів')
				.max(1500, 'Має містити 450 або менше елементів'),
		})
		.refine(
			data => {
				if (data.rating <= 2 && data.message.length < 200) {
					return false
				}
				return true
			},
			{
				message:
					'Якщо ваша оцінка становить 1 або 2 зірочки, повідомлення має бути не менше 200 символів, оскільки ми дуже стурбовані якістю нашої роботи і хочемо глибше зрозуміти, що саме не так.',
				path: ['message'],
			}
		) as ZodSchema<ReviewsFormSchema>,
	// EXTRA USER
	extraUser: z.object({
		email: z.string().email({ message: 'Невірна адреса електронної пошти' }),
		firstName: z
			.string({ invalid_type_error: "Поле 'Ім'я є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(20, 'Має містити 20 або менше елементів')
			.nullable(),
		lastName: z
			.string({ invalid_type_error: "Поле Прізвище є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(20, 'Має містити 20 або менше елементів')
			.nullable(),
		phone: z
			.string({ invalid_type_error: "Поле телефон є обов'язковим" })
			.min(13, 'Невірний номер телефону'),
	}) as ZodSchema<ExtraUser>,
	// DELIVERY
	deliveryAddress: z.object({
		typeOfDelivery: z
			.string({ required_error: 'Виберіть тип доставки' })
			.min(3, 'Виберіть тип доставки'),
		city: z
			.string({ invalid_type_error: "Поле місто є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(20, 'Має містити 20 або менше елементів'),
		street: z
			.string({ invalid_type_error: "Поле вулиця є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(3, 'Має містити 3 або більше елементів')
			.max(20, 'Має містити 50 або менше елементів'),
		houseNumber: z
			.number({ invalid_type_error: "Поле номер будинку є обов'язковим" })
			.nonnegative({ message: "Не може бути від'ємним" })
			.nullable(),
		apartmentNumber: z
			.number({ invalid_type_error: "Поле номер квартири є обов'язковим" })
			.nonnegative({ message: "Не може бути від'ємним" })
			.nullable(),
		additionNumber: z.string().nullable().optional(),
		zipCode: z
			.string({ invalid_type_error: "Поле поштовий індекс є обов'язковим" })
			.min(3, 'Має містити 3 або більше елементів')
			.max(10, 'Має містити 10 або менше елементів'),
	}) as ZodSchema<DeliveryAddress>,
	// FEEDBACK FORM
	feedbackForm: z.object({
		name: z
			.string({ required_error: "Поле 'Ім'я є обов'язковим" })
			.min(3, 'Має містити 3 або більше елементів'),
		email: z.string().email({ message: 'Невірна адреса електронної пошти' }),
		phone: z
			.string({ invalid_type_error: "Поле телефон є обов'язковим" })
			.min(13, 'Невірний номер телефону')
			.optional(),
		message: z
			.string({ invalid_type_error: "Поле повідомлення є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			}),
	}) as ZodSchema<FeedbackFormSchema>,
	// DELIVERY BRANCH
	deliveryBranch: z.object({
		typeOfDelivery: z
			.string({ invalid_type_error: 'Виберіть тип доставки' })
			.min(3, 'Bиберіть тип доставки'),
		branchNumber: z
			.string({ required_error: "Поле номер відділення є обов'язковим" })
			.min(1, 'Має містити 1 або більше елементів')
			.nullable(),
		city: z.string({ required_error: "Поле місто є обов'язковим" }),
	}) as ZodSchema<DeliveryBranch>,
	// SEARCH
	searchInput: z.object({
		inputData: z
			.string({ required_error: "Поле пошук є обов'язковим" })
			.min(3, 'Має містити 3 або більше елементів')
			.max(50, 'Має містити 50 або менше елементів'),
	}) as ZodSchema<SearchInputSchema>,
	// BONUS-CODE
	bonusCode: z.object({
		bonusCodeInput: z
			.string({ required_error: "Поле код бонусного набору є обов'язковим" })
			.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
				message: 'Використовуйте тільки кириличні символи',
			})
			.min(12, 'Має містити 12 елементів')
			.max(12, 'Має містити 12 елементів'),
	}) as ZodSchema<BonusCodeFormSchema>,
}
// CART VALIDATION
export const cartValidationSchema = z.object({
	quantity: z
		.number()
		.min(1, 'Кількість має бути більше або дорівнювати 1')
		.max(99, 'Кількість має бути менше або дорівнювати 99'),
})
// ORDER VALIDATION
export const orderItemScheme = z.object({
	profile: z
		.object({
			email: z.any(),
			firstName: z
				.string({ invalid_type_error: "Це поле є обов'язковим" })
				.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
					message: 'Використовуйте тільки кириличні символи',
				})
				.min(3, 'Має містити 3 або більше елементів')
				.max(50, 'Має містити 50 або менше елементів')
				.nullable(),
			lastName: z
				.string({ invalid_type_error: "Це поле є обов'язковим" })
				.regex(/^[\u0400-\u04FF0-9!.,",?;:() -]+$/, {
					message: 'Використовуйте тільки кириличні символи',
				})
				.min(3, 'Має містити 3 або більше елементів')
				.max(50, 'Має містити 50 або менше елементів')
				.nullable(),
			phone: z
				.string({ invalid_type_error: "Це поле є обов'язковим" })
				.min(13, 'Невірний номер телефону'),
		})
		.refine(
			data => {
				return data.firstName && data.lastName && data.email && data.phone
			},
			{
				message: 'Будь ласка, заповніть усі поля профілю',
			}
		) as ZodSchema<ProfileUserSchema>,
	payment: z.enum([Payment.POSTPAID, Payment.PAIMENTBYCARD], {
		required_error: 'Виберіть спосіб оплати',
	}),
	comment: z.string().nullable().optional(),
	cartId: z.any(),
	extra_user: any(),
	address: z
		.string({ required_error: "Це поле є обов'язковим" })
		.min(1, 'Виберіть спосіб доставки'),
}) as ZodSchema<OrderFormSchema>
