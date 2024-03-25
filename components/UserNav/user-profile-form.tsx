'use client'
import { ValidationSchema } from '@/lib/db/validation'
import { SafeUser } from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../Input'

interface UserProfileFormProps {
	currentUser: SafeUser
}
const UserProfileForm: React.FC<UserProfileFormProps> = ({ currentUser }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: currentUser.name,
			last_name: currentUser.lastName,
		},
		// CHANGE THE VALIDATION LOGIC AUTH OR LOGIN
		resolver: zodResolver(ValidationSchema.profileUser),
	})
	return (
		<>
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
					id='last_name'
					label='Last Name'
					errors={errors}
					register={register}
					required
				/>
			</form>
			<div>{currentUser.lastName}</div>
			<div>{currentUser.name}</div>
			<div>{currentUser.email}</div>
			<div>{currentUser.role}</div>
		</>
	)
}

export default UserProfileForm
