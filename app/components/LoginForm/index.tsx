'use client'
import Link from 'next/link'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../Input'

const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			email: '',
		},
	})

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setIsLoading(true)
		console.log(data)
	}
	return (
		<div className='w-full h-screen flex flex-col justify-center items-center'>
			<section className='w-1/3 shadow-lg p-5 flex flex-col justify-center items-center'>
				<h1 className='text-3xl'>Log in</h1>
				<p className='py-4'>
					Введіть свою електронну адресу, і ми надішлемо вам код входу
				</p>
				<form className='flex flex-col gap-4 w-full'>
					<Input
						type='email'
						id='email'
						label='Email'
						errors={errors}
						register={register}
						disabled={isLoading}
						required
					/>
					<button
						onClick={handleSubmit(onSubmit)}
						disabled={isLoading}
						className='bg-btnPrimary text-white p-3 text-xl my-4'
					>
						Continue
					</button>
					<Link href='/privacy' className='hover:underline'>
						ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ
					</Link>
				</form>
			</section>
		</div>
	)
}

export default LoginForm
