'use client'
import ComponentLoader from '@/app/contacts/loading'
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
import { Textarea } from '@/components/ui/textarea'
import { ValidationSchema } from '@/lib/db/validation'
import { API_URL } from '@/lib/services/constance'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import axios from 'axios'
import { Asterisk } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { z } from 'zod'

interface Props {
	currentUser?: User | null
}

export const FeedBackForm = ({ currentUser: user }: Props) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [pending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof ValidationSchema.feedbackForm>>({
		resolver: zodResolver(ValidationSchema.feedbackForm),
		defaultValues: {
			email: user?.email || '',
			name: user?.name || '',
			phone: user?.phone || '',
			message: '',
		},
	})

	const onSubmit = async (
		data: z.infer<typeof ValidationSchema.feedbackForm>
	) => {
		try {
			setLoading(true)
			const response = await axios.post(API_URL + '/feedback', data)

			if (response.status !== 200) {
				return new Error('Something went wrong')
			}

			form.reset()
			return response.status
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div>
			{pending && <ComponentLoader />}
			{loading ? (
				<div className='text-center text-2xl my-4'>
					<p>Ваш відгук надіслано, дякуємо!</p>
					<Button
						className='my-4'
						variant='default'
						onClick={() => startTransition(() => setLoading(false))}
					>
						Надіслати ще один відгук?
					</Button>
				</div>
			) : (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{/* FIRST NAME */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center my-2'>
										Прізвище <Asterisk size={12} className='text-red-500' />
									</FormLabel>
									<FormControl>
										<Input
											type='text'
											{...field}
											placeholder='введіть повне прізвище'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='md:flex gap-2 flex-row'>
							{/* PHONE */}
							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel className='flex items-center my-2'>
											Номер телефону
											<Asterisk size={12} className='text-red-500' />
										</FormLabel>
										<FormControl>
											<PhoneInput
												hideDropdown={true}
												defaultCountry='ua'
												placeholder='введіть номер телефону'
												{...field}
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
									<FormItem className='w-full'>
										<FormLabel className='flex items-center my-2'>
											Електронна пошта
											<Asterisk size={12} className='text-red-500' />
										</FormLabel>
										<FormControl>
											<Input
												type='email'
												{...field}
												placeholder='введіть електронну пошту'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* MESSAGE */}
						<FormField
							control={form.control}
							name='message'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='flex items-center my-2'>
										Повідомлення <Asterisk size={12} className='text-red-500' />
									</FormLabel>
									<FormControl>
										<Textarea {...field} placeholder='введіть повідомлення' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* BUTTON SAVE */}
						<Button
							type='button'
							onClick={() =>
								startTransition(() => form.handleSubmit(onSubmit)())
							}
							variant='office'
							className='my-4'
						>
							Надіслати
						</Button>
					</form>
				</Form>
			)}
		</div>
	)
}
