import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { ValidationSchema } from '@/lib/db/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { FormError } from '../ui/form-error'
import { FormSuccess } from '../ui/form-success'
import { Input } from '../ui/input'

interface Props {
	currentUser: User
}

export const DeliveryFormDialog = ({ currentUser }: Props) => {
	const { data: session, update } = useSession()
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const [isSuccess, setSuccess] = useState<string | undefined>('')

	// FORM VALIDATION AND ERROR HANDLING
	const form = useForm<z.infer<typeof ValidationSchema.profileUser>>({
		resolver: zodResolver(ValidationSchema.profileUser),
		defaultValues: {
			firstName: '',
			lastName: '',
		},
	})

	const onSubmit = () => {}
	return (
		<Dialog>
			<DialogTrigger className='hover:text-green-500 text-green-700 px-2'>
				+ Add
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{/* FIRST NAME */}
						<FormField
							control={form.control}
							name='firstName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input type='text' {...field} placeholder='First Name' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* LAST NAME */}
						<FormField
							control={form.control}
							name='lastName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input type='text' {...field} placeholder='Last Name' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* EMAIL */}
						<FormField
							control={form.control}
							name='email'
							disabled={true}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type='email' {...field} placeholder='Name' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormSuccess message={isSuccess} />
						<FormError message={errorMessage} />
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
