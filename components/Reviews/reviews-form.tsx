'use client'
import { addItem } from '@/actions/reviews'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ValidationSchema } from '@/lib/db/validation'
import { CurrentUser } from '@/lib/hooks/currentUser'
import { ProductsWithVariantsWithReviews } from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { RulesRPolicyInfo } from '../ui/privacy-reviews-ruls'
import { Rating } from '../ui/rating'
import { Textarea } from '../ui/textarea'
import { ReviewCancelButton } from './review-cancel-button'
import { ReviewsSubmitMessageButton } from './reviews-submit-message-button'

interface Props {
	product: ProductsWithVariantsWithReviews
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export const ReviewsForm = ({ product, setOpen, setEdit }: Props) => {
	const user = CurrentUser() as User | null
	// FORM SETUP AND VALIDATION
	const form = useForm<z.infer<typeof ValidationSchema.reviews>>({
		resolver: zodResolver(ValidationSchema.reviews),
		defaultValues: {
			fullName: user?.name || '',
			email: user?.email || '',
			message: '',
			rating: 0,
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.reviews>) => {
		try {
			// CREATE DELIVERY
			const reviewItem = addItem(product.id, data, user?.id!)

			// UPDATE DELIVERY
			await toast.promise(reviewItem, {
				loading: 'Зачекаємо...',
				success: 'Ваш відгук додано!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})

			// RESET FORM
			form.reset()

			// CLOSE FORM
			setOpen(false)

			return await reviewItem
		} catch (error) {
			console.error('Щось пішло не так, спробуйте ще раз', error)
		}
	}

	return (
		<Form {...form}>
			<form
				className='flex flex-col w-full gap-5'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className='flex gap-5 lg:w-1/2 *:w-full'>
					{/* NAME */}
					<FormField
						control={form.control}
						name='fullName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Повне Ім&rsquo;я</FormLabel>
								<FormControl>
									<Input
										type='text'
										{...field}
										placeholder='введіть повне Ім&rsquo;я'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* EMAIL */}
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										{...field}
										placeholder='john.doe@example.com'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				{/* RATING */}
				<FormField
					control={form.control}
					name='rating'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Оцінка</FormLabel>
							<FormControl>
								<Rating
									rating={field.value}
									totalStars={5}
									size={32}
									variant='yellow'
									className='h-1 pb-8 cursor-pointer'
									showText={false}
									disabled={false}
									onRatingChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='message'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Відгук</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder='введіть відгук' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex justify-end items-center gap-4'>
					<RulesRPolicyInfo label='"Відправити"' />
					<ReviewCancelButton
						labelCancel='Відмінити'
						setEdit={setEdit}
						setOpen={setOpen}
					/>
					<ReviewsSubmitMessageButton labelSubmit='Відправити' />
				</div>
			</form>
		</Form>
	)
}
