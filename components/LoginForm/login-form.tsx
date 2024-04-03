'use client'
import { ValidationSchema } from '@/lib/db/validation'
import { useSpinner } from '@/lib/hooks/useSpinner'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../Input'
import { CardWrapper } from './card-wrapper'

export const LoginForm = () => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const { isLoading, startLoading, stopLoading } = useSpinner()
	const router = useRouter()
	const { status } = useSession()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			email: 'ugnivenko.ea@gmail.com',
			password: '',
		},
		// CHANGE THE VALIDATION LOGIC AUTH OR LOGIN
		resolver: zodResolver(ValidationSchema.loginUser),
	})

	const onSubmit = (data: FieldValues) => {
		const { email, password } = data
		startLoading()
		axios
			.post('http://localhost:3000/api/login', {
				email,
				password,
			})
			.then(() => {
				// SING IN CREDENTIALS
				signIn('credentials', {
					...data,
					redirect: false,
				})
					.then(callback => {
						console.log(callback)
						if (callback?.ok) {
							router.push('/dashboard')
						}
						if (callback?.error) {
							console.log(callback.error)
						}
					})
					.catch(err => console.log(err))
					.finally(() => {
						stopLoading()
					})
			})
			.catch(error => {
				// CHECK IF ERROR IS AN AXIOS ERROR
				if (axios.isAxiosError(error)) {
					const err = error as AxiosError<{ error: string }>
					setErrorMessage(err.response?.data?.error)
				} else {
					setErrorMessage('An error occurred')
				}
			})
			.finally(() => {
				stopLoading()
			})
	}
	// TODO: need change buttonBackLabel
	return (
		<CardWrapper
			headerLabel='Введіть свій 6-значний код входу'
			buttonBackHref='/auth/register'
			buttonBackLabel='Увійдіть за допомогою іншої електронної пошти'
			buttonPrivacyHref='/privacy'
			buttonPrivacyLabel='Політика конфіденційності'
		>
			<form className='flex flex-col gap-4 w-full'>
				{/* EMAIL */}
				<Input
					type='email'
					id='email'
					label='Email'
					errors={errors}
					register={register}
					required
					errorMessage={errorMessage}
				/>
				{/* PASSWORD */}
				<Input
					type='password'
					id='password'
					label='Password'
					errors={errors}
					register={register}
					required
					errorMessage={errorMessage}
				/>
				{/* ERROR MESSAGE */}
				<p className='text-error text-sm'>{errorMessage}</p>
				<div className='justify-center flex flex-col'>
					<button
						onClick={handleSubmit(onSubmit)}
						disabled={isLoading}
						className='btn btn-primary w-full btn-lg rounded-md '
					>
						{/* CONDITION LOADING */}
						{isLoading ? (
							<span className='loading loading-ring loading-md'></span>
						) : (
							'Увійти'
						)}
					</button>
				</div>
			</form>
		</CardWrapper>
	)
}
