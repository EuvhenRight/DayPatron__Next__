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
import { Input } from '@/components/ui/input'
import { ValidationSchema } from '@/lib/db/validation'
import { ERROR_MESSAGE } from '@/lib/services/constance'
import { zodResolver } from '@hookform/resolvers/zod'
import { Gift } from 'lucide-react'
import { Dispatch, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { BannerWrapper } from './banner-wrapper'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface Props {
	setGift: Dispatch<React.SetStateAction<boolean>>
	setShowBanner: React.Dispatch<React.SetStateAction<boolean>>
}
export const BannerForm = ({ setGift, setShowBanner }: Props) => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const [isSuccess, setSuccess] = useState<boolean>(false)

	const form = useForm<z.infer<typeof ValidationSchema.authUser>>({
		resolver: zodResolver(ValidationSchema.authUser),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.authUser>) => {
		const { email } = data

		try {
			const response = await fetch(`/api/subscription`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.KEY_PASSWORD_APP}`,
				},
				body: JSON.stringify({ email }),
			})

			const responseData = await response.json()

			if (responseData?.id) {
				setSuccess(true)
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : ERROR_MESSAGE
			setErrorMessage(errorMessage)
			console.error(errorMessage)
		}
	}

	return (
		<BannerWrapper
			headerLabel='Дізнавайтеся першими про нові продукти, майбутні події та інші оновлення.'
			buttonBackLabel='Дякую, не цікаво'
			isSuccess={isSuccess}
			setShowBanner={setShowBanner}
			setGift={setGift}
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
								<FormLabel className='text-white font-light'>Email</FormLabel>
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
					<FormError message={errorMessage} />
					<Button
						type='submit'
						className='w-full flex gap-2'
						variant='destructive'
					>
						{/* CONDITION LOADING */}
						Відкрити пропозицію
						<Gift />
					</Button>
				</form>
			</Form>
		</BannerWrapper>
	)
}
