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
import { FormError } from '@/components/ui/form-error'
import { FormSuccess } from '@/components/ui/form-success'
import { Input } from '@/components/ui/input'
import { ValidationSchema } from '@/lib/db/validation'
import {
	ERROR_MESSAGE,
	SUCCESS_MESSAGE_REGISTER,
} from '@/lib/services/constance'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { BannerWrapper } from './banner-wrapper'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const BannerForm = () => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const [isSuccess, setSuccess] = useState<string | undefined>('')

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
			const response = await fetch(`/api/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.KEY_PASSWORD_APP}`,
				},
				body: JSON.stringify({ email }),
			})

			const responseData = await response.json()

			if (responseData?.id) {
				setSuccess(SUCCESS_MESSAGE_REGISTER)
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : ERROR_MESSAGE
			setErrorMessage(errorMessage)
			console.error(errorMessage)
		} finally {
			setIsButtonDisabled(false)
		}
	}

	return (
		<BannerWrapper
			headerLabel='Дізнавайтеся першими про нові продукти, майбутні події та інші оновлення.'
			buttonBackHref='Дякую, не цікаво'
			buttonBackLabel='Дякую, не цікаво'
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
						Відкрити пропозицію
					</Button>
				</form>
			</Form>
		</BannerWrapper>
	)
}
