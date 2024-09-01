'use client'
import { editItem } from '@/actions/reviews'
import { ReviewCancelButton } from '@/components/Reviews/review-cancel-button'
import { ReviewsSubmitMessageButton } from '@/components/Reviews/reviews-submit-message-button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Rating } from '@/components/ui/rating'
import { Textarea } from '@/components/ui/textarea'
import { ValidationSchema } from '@/lib/db/validation'
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

interface Props {
	reviews: ReviewsWithItems
	product: ProductsWithVariantsWithReviews
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	currentItem: string
}

export const ReviewsEditForm = ({
	reviews,
	product,
	setEdit,
	setOpen,
	currentItem,
}: Props) => {
	// FIND MESSAGE
	const findItem = reviews.messages.find(message => message.id === currentItem)
	// FORM SETUP AND VALIDATION
	const form = useForm<z.infer<typeof ValidationSchema.reviews>>({
		resolver: zodResolver(ValidationSchema.reviews),
		defaultValues: {
			fullName: findItem?.fullName,
			email: findItem?.email,
			message: findItem?.message,
			rating: findItem?.rating,
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.reviews>) => {
		try {
			// CREATE DELIVERY
			const reviewItem = editItem(product.id, data, currentItem)

			// UPDATE DELIVERY
			await toast.promise(reviewItem, {
				loading: 'Зачекаємо...',
				success: 'Ваш відгук оновлено!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})

			// RESET FORM
			form.reset()

			// CLOSE FORM
			setEdit(false)

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
				<div className='flex justify-end gap-2'>
					<ReviewCancelButton
						labelCancel='Відмінити'
						setEdit={setEdit}
						setOpen={setOpen}
					/>
					<ReviewsSubmitMessageButton labelSubmit='Зберегти' />
				</div>
			</form>
		</Form>
	)
}
