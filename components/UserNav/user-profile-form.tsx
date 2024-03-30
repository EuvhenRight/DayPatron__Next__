'use client'
import { User } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../Input'

interface UserProfileFormProps {
	currentUser: User
}
const UserProfileForm: React.FC<UserProfileFormProps> = ({ currentUser }) => {
	const route = useRouter()

	const { data: session } = useSession()
	console.log(session)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			id: currentUser.id,
			name: currentUser.name,
			lastName: currentUser.lastName,
		},
		// CHANGE THE VALIDATION LOGIC AUTH OR LOGIN
		// resolver: zodResolver(ValidationSchema.profileUser),
	})

	const onSubmit = async (data: FieldValues) => {
		const { name, lastName } = data
		try {
			const response = await axios.patch(
				`http://localhost:3000/api/users/edit/${currentUser.id}`,
				{
					name,
					lastName,
				}
			)
			if (response.status === 202) {
				console.log('User updated successfully:', response.data)
				route.refresh()
				return response.data // Return the updated user data
			} else {
				console.error('Failed to update user:', response.statusText)
			}
		} catch (err) {
			console.log(err)
		}
	}

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
					id='lastName'
					label='Last Name'
					errors={errors}
					register={register}
					required
				/>
				<button
					className='btn btn-primary w-3'
					onClick={handleSubmit(onSubmit)}
				>
					Safe
				</button>
			</form>
			<div>{currentUser.lastName}</div>
			<div>{currentUser.lastName}</div>
			<div>{currentUser.email}</div>
			<div>{currentUser.role}</div>
			<div>{currentUser.id}</div>
		</>
	)
}

export default UserProfileForm
