'use client'
import { User } from '@prisma/client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../Input'

interface Props {
	currentUser: User
}
export const UserProfileForm = ({ currentUser }: Props) => {
	const route = useRouter()

	const { data: session, update } = useSession()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			id: currentUser.id,
			name: currentUser.name,
		},
		// TODO: CHANGE THE VALIDATION LOGIC AUTH OR LOGIN
		// resolver: zodResolver(ValidationSchema.profileUser),
	})

	return (
		<div>
			<form className='flex flex-col gap-4 w-full'>
				{/* NAME */}
				<Input
					type='text'
					id='name'
					label='Name'
					errors={errors}
					register={register}
					required
				/>
				{/* LAST NAME */}
				<Input
					type='text'
					id='lastName'
					label='Last Name'
					errors={errors}
					register={register}
					required
				/>
				<button className='btn btn-primary w-3'>Safe</button>
			</form>
			<div>{currentUser.email}</div>
			<div>{currentUser.role}</div>
			<div>{currentUser.id}</div>
		</div>
	)
}
