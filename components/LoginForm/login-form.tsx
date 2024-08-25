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
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { ValidationSchema } from '@/lib/db/validation'
import {
	API_URL,
	ERROR_MESSAGE,
	SUCCESS_MESSAGE_LOGIN,
} from '@/lib/services/constance'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export const LoginForm = () => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const [isSuccess, setSuccess] = useState<string | undefined>('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const router = useRouter()

	// FORM VALIDATION AND ERROR HANDLING
	const form = useForm<z.infer<typeof ValidationSchema.loginUser>>({
		resolver: zodResolver(ValidationSchema.loginUser),
		defaultValues: {
			email: 'ugnivenko.ea@gmail.com',
			password: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.loginUser>) => {
		const { email, password } = data
		setIsButtonDisabled(true)
		setErrorMessage('')
		setSuccess('')

		try {
			const response = await axios.post(API_URL + '/login', {
				email,
				password,
			})

			// HANDLE AXIOS ERROR
			if (response.data?.error) {
				setErrorMessage(SUCCESS_MESSAGE_LOGIN)
			} else {
				// SING IN CREDENTIALS
				await signIn('credentials', {
					...data,
					redirect: false,
				})

				// REDIRECT TO DASHBOARD PAGE
				router.push('/dashboard/profile')
			}
		} catch (error) {
			// HANDLE AXIOS ERROR
			if (axios.isAxiosError(error)) {
				const err = error as AxiosError<{ error: string }>
				setErrorMessage(err.response?.data?.error || ERROR_MESSAGE)
			}
		} finally {
			setIsButtonDisabled(false)
		}
	}

	return (
		<CardWrapper
			headerLabel='Введіть свій 6-значний код входу'
			buttonBackHref='/auth/register'
			buttonBackLabel='Увійдіть за допомогою іншої електронної пошти'
			buttonPrivacyHref='/privacy'
			buttonPrivacyLabel='Політика конфіденційності'
			showSocial
		>
			<Form {...form}>
				<form
					className='flex flex-col w-full gap-5'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className='space-y-4'>
						{/* FORM FIELDS */}
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
											placeholder='введіть електронну пошту'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<InputOTP {...field} maxLength={6}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSeparator />
												<InputOTPSlot index={1} />
												<InputOTPSeparator />
												<InputOTPSlot index={2} />
												<InputOTPSeparator />
												<InputOTPSlot index={3} />
												<InputOTPSeparator />
												<InputOTPSlot index={4} />
												<InputOTPSeparator />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormSuccess message={isSuccess} />
						<FormError message={errorMessage} />
					</div>
					<Button
						type='submit'
						className='w-full'
						variant='office'
						disabled={isButtonDisabled}
					>
						{/* CONDITION LOADING */}
						Увійти
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}
