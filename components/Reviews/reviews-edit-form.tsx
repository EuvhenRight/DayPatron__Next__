'use client'
import { editItem } from '@/actions/reviews'
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
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Rating } from '../ui/rating'
import { Textarea } from '../ui/textarea'
import { ReviewsSubmitMessageButton } from './reviews-submit-message-button'

interface Props {
	reviews: ReviewsWithItems
	product: ProductsWithVariantsWithReviews
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export const ReviewsEditForm = ({ reviews, product, setEdit }: Props) => {
	// FIND MESSAGE
	const messageItem = reviews.messages.find(
		item => item.email === CurrentUser()?.email
	)

	const user = CurrentUser() as User | null

	const form = useForm<z.infer<typeof ValidationSchema.reviews>>({
		resolver: zodResolver(ValidationSchema.reviews),
		defaultValues: {
			fullName: messageItem?.fullName,
			email: messageItem?.email,
			message: messageItem?.message,
			rating: messageItem?.rating,
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.reviews>) => {
		let reviewItem: Promise<ReviewsWithItems>

		try {
			// CREATE DELIVERY
			reviewItem = new Promise<ReviewsWithItems>(resolve => {
				resolve(editItem(product.id, data, user?.id!))
			})

			// UPDATE DELIVERY
			await toast.promise(reviewItem, {
				loading: 'Зачекаємо...',
				success: 'Ваш відгук додано!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})
			form.reset()
			// CLOSE FORM
			setEdit(false)
			return { ...reviewItem }
		} catch (error) {
			console.error(error, 'Щось пішло не так, спробуйте ще раз')
		}
	}

	return (
		<Form {...form}>
			<form
				className='flex flex-col w-full gap-5'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className='flex gap-5 w-1/2 *:w-full'>
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
										disabled
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
				<div className='flex justify-end'>
					<ReviewsSubmitMessageButton labelSubmit='Зберегти' />
				</div>
			</form>
		</Form>
	)
}