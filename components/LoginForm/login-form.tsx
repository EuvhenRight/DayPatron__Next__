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
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '../ui/input-otp'

export const LoginForm = () => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const [isSuccess, setSuccess] = useState<string | undefined>('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const router = useRouter()

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
			const response = await axios.post('http://localhost:3000/api/login', {
				email,
				password,
			})

			// Check if response has an error
			if (response.data?.error) {
				setErrorMessage('Invalid email or password, please try again')
			} else {
				// SING IN CREDENTIALS
				await signIn('credentials', {
					...data,
					redirect: false,
				})

				// Redirect to dashboard upon successful sign-in
				router.push('/dashboard')
			}
		} catch (error) {
			// Handle Axios error
			if (axios.isAxiosError(error)) {
				const err = error as AxiosError<{ error: string }>
				setErrorMessage(err.response?.data?.error || 'Something went wrong')
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
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<InputOTP {...field} maxLength={6}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
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
