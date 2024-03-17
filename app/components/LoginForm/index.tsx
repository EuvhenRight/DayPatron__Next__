'use client'
import { ValidationSchema } from '@/app/lib/db/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../Input'

const LoginForm = () => {
	const [errorMessage, setErrorMessage] = useState<string>()
	const [isAuthUser, setIsAuthUser] = useState(false)
	const [spinner, setSpinner] = useState(false)
	const router = useRouter()

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
		resolver: zodResolver(
			!isAuthUser ? ValidationSchema.authUser : ValidationSchema.loginUser
		),
	})
	// ONSUBMIT HANDLER AUTH OR LOGIN
	const onSubmit: SubmitHandler<FieldValues> = async data => {
		const { email, password } = data
		// AUTH
		if (!isAuthUser) {
			try {
				setSpinner(true)
				const response = await axios.post(
					'http://localhost:3000/api/register',
					{
						email,
					}
				)
				console.log(response.data)
			} catch (error) {
				console.log(error)
			}
			setSpinner(false)
		}
		setIsAuthUser(true)
		// LOGIN
		if (isAuthUser) {
			try {
				setSpinner(true)
				const response = await axios.post('http://localhost:3000/api/login', {
					email,
					password,
				})
				signIn('credentials', {
					...data,
					redirect: false,
				})
					.then(callback => {
						if (callback?.ok) {
							router.push('/dashboard')
						}
						if (callback?.error) {
							console.log(callback.error)
						}
					})
					.catch(err => console.log(err))
					.finally(() => {
						setIsAuthUser(false), setSpinner(false)
					})
				console.log(response.data)
			} catch (error) {
				// CHECK IF ERROR IS AN AXIOS ERROR
				if (axios.isAxiosError(error)) {
					const err = error as AxiosError<{ error: string }>
					setErrorMessage(err.response?.data?.error)
				} else {
					setErrorMessage('An error occurred')
				}
				setSpinner(false)
			}
		}
	}

	const handleLogin = () => {
		setIsAuthUser(false)
	}
	return (
		<div className='w-full h-screen flex flex-col justify-center items-center'>
			<section className='w-11/12 md:w-auto shadow-xl p-5 flex flex-col justify-center items-center'>
				<h1 className='text-3xl'>Увійдіть до свого облікового запису</h1>
				<p className='py-4'>
					Введіть свою електронну адресу, і ми надішлемо вам код входу
				</p>
				<form className='flex flex-col gap-4 w-full'>
					{/* EMAIL */}
					<Input
						type='email'
						id='email'
						label='Email'
						errors={errors}
						disabled={isAuthUser}
						register={register}
						required
					/>
					{/* PASSWORD */}
					{isAuthUser && (
						<Input
							type='password'
							id='password'
							label='Password'
							errors={errors}
							register={register}
							required
							errorMessage={errorMessage}
						/>
					)}
					{/* ERROR MESSAGE */}
					{errorMessage && <p className='text-error'>{errorMessage}</p>}
					<button
						onClick={handleSubmit(onSubmit)}
						className='btn btn-error w-full btn-lg'
					>
						{/* SPINNER */}
						{spinner ? (
							<span className='loading loading-ring loading-md'></span>
						) : isAuthUser ? (
							'ВХІД'
						) : (
							'Продовжити'
						)}
					</button>
					{/* CHANGE EMAIL */}
					{isAuthUser && (
						<p onClick={handleLogin} className='link link-info'>
							Увійдіть за допомогою іншої електронної пошти
						</p>
					)}
					{/* PRIVACY POLICY */}
					<Link href='/privacy' className='link link-info'>
						ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ
					</Link>
				</form>
			</section>
		</div>
	)
}

export default LoginForm
