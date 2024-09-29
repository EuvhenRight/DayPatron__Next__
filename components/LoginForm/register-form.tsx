'use client'
import { CardWrapper } from '@/components/LoginForm/card-wrapper'
import { Button } from '@/components/ui/button'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { FormError } from '@/components/ui/form-error'
import { FormSuccess } from '@/components/ui/form-success'
import { Input } from '@/components/ui/input'
import { ValidationSchema } from '@/lib/db/validation'
import {
	ERROR_MESSAGE,
	SUCCESS_MESSAGE_REGISTER,
} from '@/lib/services/constance'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export const RegisterForm = () => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const [isSuccess, setSuccess] = useState<string | undefined>('')

	const router = useRouter()
	const form = useForm<z.infer<typeof ValidationSchema.authUser>>({
		resolver: zodResolver(ValidationSchema.authUser),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.authUser>) => {
		setIsButtonDisabled(true)
		const { email } = data
		try {
			const { data } = await axios.post(
				process.env.NEXT_PUBLIC_API_URL + '/api/register',
				{
					email,
				}
			)
			data
			if (data?.id) {
				setSuccess(SUCCESS_MESSAGE_REGISTER)
			}
			router.push('/auth/login')
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const err = (await error) as AxiosError<{ error: string }>
				setErrorMessage(err.response?.data?.error)
			} else {
				setErrorMessage(ERROR_MESSAGE)
			}
			console.log(error)
		} finally {
			setIsButtonDisabled(false)
		}
	}
	return (
		<CardWrapper
			headerLabel='Введіть свою електронну адресу, і ми надішлемо вам код входу'
			buttonBackHref=''
			buttonPrivacyHref='/privacy'
			buttonPrivacyLabel='Політика конфіденційності'
			showSocial
		>
			<Form {...form}>
				<form
					className='flex flex-col w-full gap-5'
					onSubmit={form.handleSubmit(onSubmit)}
				>
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
					<FormSuccess message={isSuccess} />
					<FormError message={errorMessage} />
					<Button
						type='submit'
						className='w-full'
						variant='office'
						disabled={isButtonDisabled}
					>
						{/* CONDITION LOADING */}
						Надіслати код входу
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
