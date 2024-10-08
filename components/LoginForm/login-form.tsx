'use client'
import { enter } from '@/actions/enter'
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
<<<<<<< Updated upstream
import { ERROR_MESSAGE } from '@/lib/services/constance'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
=======
import { ERROR_MESSAGE, ERROR_MESSAGE_SIGNIN } from '@/lib/services/constance'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
>>>>>>> Stashed changes
import { useEffect, useState } from 'react'
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
			email: '',
			password: '',
		},
	})

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const email = urlParams.get('email')
		if (email) {
			form.setValue('email', email)
		}
	}, [form])

	const onSubmit = async (data: z.infer<typeof ValidationSchema.loginUser>) => {
		setIsButtonDisabled(true)
		setErrorMessage('')
		setSuccess('')

		try {
<<<<<<< Updated upstream
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email,
						password,
					}),
				}
			)

			const responseData = await response.json()

			// HANDLE ERROR RESPONSE
			if (!response.ok) {
				setErrorMessage(responseData.error || ERROR_MESSAGE)
				return
			}

			// SIGN IN CREDENTIALS
			await signIn('credentials', {
				...data,
				redirect: false,
			})

			// REDIRECT TO DASHBOARD PAGE
			router.push('/dashboard/profile')
=======
			const response = await enter(data)

			return response
>>>>>>> Stashed changes
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : ERROR_MESSAGE
			setErrorMessage(errorMessage)
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
					className='flex flex-col w-full gap-1 sm:gap-5'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div>
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
								<FormItem className='my-4'>
									<FormLabel className='block text-gray-700 text-sm font-bold mb-2'>
										Password
									</FormLabel>
									<FormControl className='mb-2'>
										<InputOTP
											{...field}
											maxLength={6}
											className='flex justify-between'
										>
											<InputOTPGroup className='w-full flex justify-center'>
												<InputOTPSlot
													index={0}
													className='sm:w-10 w-8 h-10 text-center border border-gray-300 rounded-md focus:ring focus:ring-blue-500'
												/>
												<InputOTPSeparator className='mx-0 sm:mx-1' />
												<InputOTPSlot
													index={1}
													className='sm:w-10 w-8 h-10 text-center border border-gray-300 rounded-md focus:ring focus:ring-blue-500'
												/>
												<InputOTPSeparator className='mx-0 sm:mx-1' />
												<InputOTPSlot
													index={2}
													className='sm:w-10 w-8 h-10 text-center border border-gray-300 rounded-md focus:ring focus:ring-blue-500'
												/>
												<InputOTPSeparator className='mx-0 sm:mx-1' />
												<InputOTPSlot
													index={3}
													className='sm:w-10 w-8 h-10 text-center border border-gray-300 rounded-md focus:ring focus:ring-blue-500'
												/>
												<InputOTPSeparator className='mx-0 sm:mx-1' />
												<InputOTPSlot
													index={4}
													className='sm:w-10 w-8 h-10 text-center border border-gray-300 rounded-md focus:ring focus:ring-blue-500'
												/>
												<InputOTPSeparator className='mx-0 sm:mx-1' />
												<InputOTPSlot
													index={5}
													className='sm:w-10 w-8 h-10 text-center border border-gray-300 rounded-md focus:ring focus:ring-blue-500'
												/>
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage className='text-red-500' />
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
