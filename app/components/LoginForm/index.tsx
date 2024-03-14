'use client'
import { ValidationSchema } from '@/app/lib/db/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../Input'

const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false)
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
		resolver: zodResolver(
			!isLoading ? ValidationSchema.authUser : ValidationSchema.loginUser
		),
	})

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		const { email, password } = data
		// AUTH
		if (!isLoading) {
			setSpinner(true)
			try {
				const response = await axios.post('http://localhost:3000/api/auth', {
					email,
				})
				console.log(response.data)
			} catch (error) {
				console.log(error)
			}
			setSpinner(false)
		}
		setIsLoading(true)
		// LOGIN
		if (isLoading) {
			setSpinner(true)
			try {
				const response = await axios.post('http://localhost:3000/api/login', {
					email,
					password,
				})
				console.log(response.data)
			} catch (error) {
				console.log(error)
			}
			setSpinner(false)
			router.push('/dashboard')
		}
	}

	const handleLogin = () => {
		setIsLoading(false)
	}
	return (
		<div className='w-full h-screen flex flex-col justify-center items-center'>
			<section className='w-11/12 md:w-auto shadow-xl p-5 flex flex-col justify-center items-center'>
				<h1 className='text-3xl'>Log in</h1>
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
						disabled={isLoading}
						register={register}
						required
					/>
					{/* PASSWORD */}
					{isLoading && (
						<Input
							type='password'
							id='password'
							label='Password'
							errors={errors}
							register={register}
							required
						/>
					)}
					<button
						onClick={handleSubmit(onSubmit)}
						className='bg-btnPrimary text-white p-3 text-xl my-4 flex '
					>
						{isLoading ? 'ВХІД' : 'Продовжити'}
						{/* SPINNER */}
						{spinner && (
							<span className='loading loading-ring loading-md ml-4'></span>
						)}
					</button>
					{/* CHANGE EMAIL */}
					{isLoading && (
						<p
							onClick={handleLogin}
							className='cursor-pointer hover:underline text-sky-600'
						>
							Увійдіть за допомогою іншої електронної пошти
						</p>
					)}
					{/* PRIVACY POLICY */}
					<Link
						href='/privacy'
						className='text-sky-600 cursor-pointer hover:underline'
					>
						ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ
					</Link>
				</form>
			</section>
		</div>
	)
}

export default LoginForm
