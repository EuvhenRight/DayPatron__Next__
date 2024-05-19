import { editInfoUser } from '@/actions/user'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { FormError } from '@/components/ui/form-error'
import { FormSuccess } from '@/components/ui/form-success'
import { Input } from '@/components/ui/input'
import { ValidationSchema } from '@/lib/db/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { Pencil } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
	currentUser: User
}

export const UserFormDialog = ({ currentUser }: Props) => {
	const [errorMessage, setErrorMessage] = useState<string | undefined>('')
	const [isSuccess, setSuccess] = useState<string | undefined>('')
	const [pending, startTransition] = useTransition()

	// FORM VALIDATION AND ERROR HANDLING
	const form = useForm<z.infer<typeof ValidationSchema.profileUser>>({
		resolver: zodResolver(ValidationSchema.profileUser),
		defaultValues: {
			email: currentUser.email || '',
			firstName: currentUser.first_name || '',
			lastName: currentUser.last_name || '',
		},
	})

	const onSubmit = async (
		data: z.infer<typeof ValidationSchema.profileUser>
	) => {
		const { firstName, lastName } = data
		setErrorMessage('')
		setSuccess('')

		if (!currentUser) {
			toast.error('Щось пішло не так, спробуйте ще раз')
			return
		}
		// UPDATE USER SONNER INFO
		let userPromise: Promise<User>
		try {
			userPromise = new Promise<User>(resolve => {
				startTransition(() => {
					resolve(editInfoUser(currentUser.id, firstName, lastName))
				})
			})
			// UPDATE USER PROMISE AND TOAST
			await toast.promise(userPromise, {
				loading: 'Зачекаємо...',
				success: 'Ваш профіль було оновлено!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})
		} catch (error) {
			toast.error('Щось пішло не так, спробуйте ще раз')
		}
	}

	return (
		<Dialog>
			<DialogTrigger className='hover:text-gray-500'>
				<Pencil />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Змінити інформацію профілю</DialogTitle>
				</DialogHeader>
				<div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							{/* FIRST NAME */}
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ім&rsquo;я</FormLabel>
										<FormControl>
											<Input
												type='text'
												{...field}
												placeholder='введіть Ім&rsquo;я'
											/>
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
										<FormLabel>Прізвище</FormLabel>
										<FormControl>
											<Input
												type='text'
												{...field}
												placeholder='введіть Прізвище'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* EMAIL */}
							<FormField
								name='email'
								disabled={true}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<Input type='email' {...field} placeholder='Name' />
									</FormItem>
								)}
							/>
							<p className='text-red-500 text-[12px] text-center px-2'>
								Ви не можете змінити електронну адресу в цьому профілі!
							</p>
							<FormSuccess message={isSuccess} />
							<FormError message={errorMessage} />
							<div className='flex justify-end relative'>
								<Button
									type='submit'
									variant='office'
									className='mt-4'
									disabled={pending}
								>
									Зберегти
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}
