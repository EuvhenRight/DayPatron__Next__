'use client'
import { addItem } from '@/actions/reviews'
import { Button } from '@/components/ui/button'
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
import {
	ProductsWithVariantsWithReviews,
	ReviewsWithItems,
} from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { Rating } from '../ui/rating'
import { Textarea } from '../ui/textarea'

interface Props {
	reviews: ReviewsWithItems
	product: ProductsWithVariantsWithReviews
}

export const ReviewsForm = ({ reviews, product }: Props) => {
	const form = useForm<z.infer<typeof ValidationSchema.reviews>>({
		resolver: zodResolver(ValidationSchema.reviews),
		defaultValues: {
			fullName: 'аиарира',
			email: 'WW@gmail.com',
			message: 'аиіиіви',
			rating: 0,
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.reviews>) => {
		let reviewItem: Promise<ReviewsWithItems>

		try {
			// CREATE DELIVERY
			reviewItem = new Promise<ReviewsWithItems>(resolve => {
				resolve(addItem(product.id, data))
			})

			// UPDATE DELIVERY
			await toast.promise(reviewItem, {
				loading: 'Зачекаємо...',
				success: 'Ваш відгук додано!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})
			form.reset()
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
									className='h-1 my-4'
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
				<Button type='submit' className='w-full' variant='office'>
					{/* CONDITION LOADING */}
					Залишити відгук
				</Button>
			</form>
		</Form>
	)
}
