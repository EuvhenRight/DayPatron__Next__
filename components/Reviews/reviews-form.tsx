'use client'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'

export const ReviewsForm = () => {
	const form = useForm<z.infer<typeof ValidationSchema.reviews>>({
		resolver: zodResolver(ValidationSchema.reviews),
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
	})

	const onSubmit = () => {
		console.log(form.getValues())
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
					name='name'
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
