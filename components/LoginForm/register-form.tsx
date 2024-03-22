'use client'
import { ValidationSchema } from '@/lib/db/validation'
import { useSpinner } from '@/lib/hooks/useSpinner'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../Input'
import { CardWrapper } from './card-wrapper'

export const RegisterForm = () => {
	const [errorMessage, setErrorMessage] = useState<string>('')
	const { isLoading, startLoading, stopLoading } = useSpinner()
	const { status } = useSession()
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			email: 'ugnivenko.ea@gmail.com',
		},
		// CHANGE THE VALIDATION LOGIC AUTH OR LOGIN
		resolver: zodResolver(ValidationSchema.authUser),
	})

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		const { email } = data
		startLoading() // Start the loading spinner immediately
		try {
			const response = await axios.post('http://localhost:3000/api/register', {
				email,
			})
			console.log(response.data)
		} catch (error) {
			console.log(error)
		} finally {
			stopLoading() // Stop the loading spinner once the request is complete
			router.push('/auth/login') // Navigate to the login page
		}
	}

	// CHECK IF USER IS ALREADY LOGGED IN
	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/dashboard')
			router.refresh()
		}
	}, [status, router])

	// CHECK IF USER IS ALREADY LOGGED IN
	if (status === 'authenticated') {
		return (
			<>
				<p className='text-center py-4 text-lg'>
					Ви вже авторизовані, перенаправлення...
				</p>
			</>
		)
	}

	return (
		<CardWrapper
			headerLabel='Введіть свою електронну адресу, і ми надішлемо вам код входу'
			buttonBackHref=''
			buttonPrivacyHref='/privacy'
			buttonPrivacyLabel='Політика конфіденційності'
			showSocial
		>
			<form className='flex flex-col w-full gap-4'>
				{/* EMAIL */}
				<Input
					type='email'
					id='email'
					label='Email'
					errors={errors}
					register={register}
					required
				/>
				{/* ERROR MESSAGE */}
				<p className='text-error'>{errorMessage}</p>
				<div className='card-actions justify-center flex flex-col'>
					<button
						onClick={handleSubmit(onSubmit)}
						className='btn btn-primary w-full btn-lg rounded-md'
						disabled={isLoading}
					>
						{/* CONDITION LOADING */}
						{isLoading ? (
							<span className='loading loading-ring loading-md'></span>
						) : (
							'Надіслати код входу'
						)}
					</button>
				</div>
			</form>
		</CardWrapper>
	)
}
