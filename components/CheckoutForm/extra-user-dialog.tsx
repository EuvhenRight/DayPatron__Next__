'use client'
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
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { z } from 'zod'

interface Props {
	onChange?: (value: z.infer<typeof ValidationSchema.extraUser>) => void
	setExtraUser: (value: z.infer<typeof ValidationSchema.extraUser>) => void
}
export const ExtraUserDialog = ({ onChange, setExtraUser }: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	// FORM VALIDATION AND ERROR HANDLING
	const form = useForm<z.infer<typeof ValidationSchema.extraUser>>({
		resolver: zodResolver(ValidationSchema.extraUser),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof ValidationSchema.extraUser>) => {
		setExtraUser(data)
		onChange!(data)
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
							{/* PHONE */}
							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Номер телефону</FormLabel>
										<FormControl>
											<PhoneInput
												placeholder='введіть номер телефону'
												inputStyle={{
													width: '100%',
												}}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* EMAIL */}
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type='email'
												{...field}
												placeholder='введіть електронну пошту'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
