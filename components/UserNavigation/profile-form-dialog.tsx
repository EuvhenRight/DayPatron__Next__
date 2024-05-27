import { editInfoUser } from '@/actions/user'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
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
import { Input } from '@/components/ui/input'
import { ValidationSchema } from '@/lib/db/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
	currentUser: User
}

export const ProfileFormDialog = ({ currentUser }: Props) => {
	const [isOpen, setIsOpen] = useState(false)

	// FORM VALIDATION AND ERROR HANDLING
	const form = useForm<z.infer<typeof ValidationSchema.profileUser>>({
		resolver: zodResolver(ValidationSchema.profileUser),
		defaultValues: {
			email: currentUser.email || '',
			firstName: currentUser.firstName || '',
			lastName: currentUser.lastName || '',
		},
	})

	const onSubmit = async (
		data: z.infer<typeof ValidationSchema.profileUser>
	) => {
		const { firstName, lastName } = data

		if (!currentUser) {
			toast.error('Щось пішло не так, спробуйте ще раз')
			return
		}
		// UPDATE USER SONNER INFO
		let userPromise: Promise<User>
		try {
			userPromise = new Promise<User>(resolve => {
				resolve(editInfoUser(currentUser.id, firstName, lastName))
			})
			// UPDATE USER PROMISE AND TOAST
			await toast.promise(userPromise, {
				loading: 'Зачекаємо...',
				success: 'Ваш профіль було оновлено!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})

			return setIsOpen(!isOpen)
		} catch (error) {
			toast.error('Щось пішло не так, спробуйте ще раз')
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className='hover:text-green-500 text-green-700 px-2'>
				<Pencil style={{ width: '20px', height: '20px' }} />
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
							<p className='text-zinc-700 text-[12px] text-start px-2'>
								Ви не можете змінити електронну адресу в цьому профілі!
							</p>
							<div className='flex items-center justify-end relative mt-4'>
								{/* BUTTON CLOSE */}
								<DialogClose asChild>
									<Button variant='link' type='button'>
										Скасувати
									</Button>
								</DialogClose>
								{/* BUTTON SAVE */}
								<Button type='submit' variant='office'>
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
