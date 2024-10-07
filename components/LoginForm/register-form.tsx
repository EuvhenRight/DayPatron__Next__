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
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/register`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email }),
				}
			)

			const responseData = await response.json()

			if (!response.ok) {
				throw new Error(responseData.error || 'An error occurred')
			}

			if (responseData?.id) {
				setSuccess(SUCCESS_MESSAGE_REGISTER)
			}

			router.push(`/auth/login?email=${encodeURIComponent(email)}`)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : ERROR_MESSAGE
			setErrorMessage(errorMessage)
			console.error(error)
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
