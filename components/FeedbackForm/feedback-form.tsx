'use client'
import ContactsLoader from '@/components/FeedbackForm/loading'
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
import data from '@/lib/db/content.json'
import { ValidationSchema } from '@/lib/db/validation'
import { API_URL } from '@/lib/services/constance'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import axios from 'axios'
import { Asterisk } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { z } from 'zod'

interface Props {
	currentUser?: User | null
}

export const FeedBackForm = ({ currentUser: user }: Props) => {
	// DATA CONTENT
	const { ContentContactsPage } = data
	// STATE CHANGE FORMS
	const [loading, setLoading] = useState<boolean>(false)
	// STATE CHANGE LOADER
	const [success, setSuccess] = useState<boolean>(false)

	// FORM VALIDATION
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
			setSuccess(true)
			const response = await axios.post(API_URL + '/feedback', data)

			if (response.status !== 200) {
				return new Error('Something went wrong')
			}

			form.reset()
			return response.status
		} catch (err) {
			console.log(err)
		} finally {
			setSuccess(false)
		}
	}

	// LOADER
	if (success) {
		return <ContactsLoader />
	}

	return (
		<div>
			{/* FEEDBACK SENT */}
			{loading && !success ? (
				<div className='text-center text-2xl'>
					<p className={cn(rubikGlitch.className, 'text-2xl')}>
						{ContentContactsPage.form.feedback_sent_message}
					</p>
					<Button
						className='my-4'
						variant='default'
						onClick={() => setLoading(false)}
					>
						{ContentContactsPage.form.send_another_feedback_button}
					</Button>
				</div>
			) : (
				// FEEDBACK FORM
				<>
					<h1
						className={cn(
							rubikGlitch.className,
							'text-2xl font-bold text-center pb-10'
						)}
					>
						{ContentContactsPage.form.title}
					</h1>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							{/* FIRST NAME */}
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex items-center my-4'>
											{ContentContactsPage.form.surname_label}
											<Asterisk size={12} className='text-red-500' />
										</FormLabel>
										<FormControl>
											<Input
												type='text'
												{...field}
												placeholder={
													ContentContactsPage.form.surname_placeholder
												}
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
											<FormLabel className='flex items-center my-4'>
												{ContentContactsPage.form.phone_label}
												<Asterisk size={12} className='text-red-500' />
											</FormLabel>
											<FormControl>
												<PhoneInput
													hideDropdown={true}
													defaultCountry='ua'
													placeholder={
														ContentContactsPage.form.phone_placeholder
													}
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
											<FormLabel className='flex items-center my-4'>
												{ContentContactsPage.form.email_label}
												<Asterisk size={12} className='text-red-500' />
											</FormLabel>
											<FormControl>
												<Input
													type='email'
													{...field}
													placeholder={
														ContentContactsPage.form.email_placeholder
													}
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
										<FormLabel className='flex items-center my-4'>
											{ContentContactsPage.form.message_label}
											<Asterisk size={12} className='text-red-500' />
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder={
													ContentContactsPage.form.message_placeholder
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* BUTTON SAVE */}
							<div className='text-end'>
								<Button type='submit' variant='office' className='my-4'>
									{ContentContactsPage.form.submit_button}
								</Button>
							</div>
						</form>
					</Form>
				</>
			)}
		</div>
	)
}
