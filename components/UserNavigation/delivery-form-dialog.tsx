import { addItemDelivery } from '@/actions/delivery'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
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
import { RadioTypesOfDelivery } from '@/components/UserNavigation/radio-types-of-delivery'
import { ValidationSchema } from '@/lib/db/validation'
import { DeliveryWithItems } from '@/lib/types/types'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
	setTypeOfDelivery: React.Dispatch<React.SetStateAction<string>>
	typeOfDelivery: string
}

export const DeliveryFormDialog = ({
	typeOfDelivery,
	setTypeOfDelivery,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false)
	// STATE AND HANDLERS
	const getValidationSchema = (typeOfDelivery: string) => {
		return typeOfDelivery === 'У відділення'
			? ValidationSchema.deliveryBranch
			: ValidationSchema.deliveryAddress
	}

	const getDefaultValues = (typeOfDelivery: string) => {
		return typeOfDelivery === 'У відділення'
			? {
					typeOfDelivery: '',
					branchNumber: '',
			  }
			: {
					typeOfDelivery: '',
					city: '',
					street: '',
					houseNumber: '',
					apartmentNumber: '',
					additionNumber: '',
					zipCode: '',
			  }
	}

	const getFormConfig = (typeOfDelivery: string) => {
		return {
			resolver: zodResolver(getValidationSchema(typeOfDelivery)),
			defaultValues: getDefaultValues(typeOfDelivery),
		}
	}

	const formConfig = getFormConfig(typeOfDelivery)
	const form =
		useForm<
			z.infer<
				| typeof ValidationSchema.deliveryBranch
				| typeof ValidationSchema.deliveryAddress
			>
		>(formConfig)

	const onSubmit = async (formConfig: any) => {
		let deliveryItem: Promise<DeliveryWithItems>
		try {
			// CREATE DELIVERY
			deliveryItem = new Promise<DeliveryWithItems>(resolve => {
				resolve(addItemDelivery(formConfig))
			})

			// UPDATE DELIVERY
			await toast.promise(deliveryItem, {
				loading: 'Зачекаємо...',
				success: 'Вашу інформацію оновлено!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})

			return setIsOpen(!isOpen)
		} catch (error) {
			console.error(error, 'Щось пішло не так, спробуйте ще раз')
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className='hover:text-green-500 text-green-700 px-2'>
				+ Add
			</DialogTrigger>
			<DialogContent className='sm:max-w-[768px]'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{typeOfDelivery === 'У відділення' ? (
							<>
								{/* TYPE OF DELIVERY */}
								<FormField
									control={form.control}
									name='typeOfDelivery'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<RadioTypesOfDelivery
													setTypeOfDelivery={setTypeOfDelivery}
													onChange={field.onChange}
													typeOfDelivery={typeOfDelivery}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* BRANCH NUMBER */}
								<FormField
									control={form.control}
									name='branchNumber'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Номер відділення</FormLabel>
											<FormControl>
												<Input
													type='text'
													{...field}
													placeholder='Вкажи номер відділення'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						) : (
							<>
								{/* TYPE OF DELIVERY */}
								<FormField
									control={form.control}
									name='typeOfDelivery'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<RadioTypesOfDelivery
													setTypeOfDelivery={setTypeOfDelivery}
													onChange={field.onChange}
													typeOfDelivery={typeOfDelivery}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='grid grid-cols-[2fr,1fr] gap-2'>
									{/* CITY */}
									<FormField
										control={form.control}
										name='city'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Населений пункт</FormLabel>
												<FormControl>
													<Input
														type='text'
														{...field}
														placeholder='Вкажи населений пункт'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{/* ZIP CODE */}
									<FormField
										control={form.control}
										name='zipCode'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Поштовий індекс</FormLabel>
												<FormControl>
													<Input
														type='text'
														{...field}
														placeholder='Вкажи поштовий індекс'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{/* STREET */}
								<FormField
									control={form.control}
									name='street'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Вулиця</FormLabel>
											<FormControl>
												<Input
													type='text'
													{...field}
													placeholder='Вкажи вулицю'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='grid grid-cols-3 gap-2'>
									{/* HOUSE NUMBER */}
									<FormField
										control={form.control}
										name='houseNumber'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Будинок</FormLabel>
												<FormControl>
													<Input
														type='number'
														{...field}
														placeholder='Вкажи будинок'
														onChange={e =>
															field.onChange(parseInt(e.target.value, 10))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{/* ADDITION NUMBER */}
									<FormField
										control={form.control}
										name='additionNumber'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Додаткова літера(опціонально)</FormLabel>
												<FormControl>
													<Input
														type='text'
														{...field}
														placeholder='Вкажи додаткову літеру'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{/* APARTMENT NUMBER */}
									<FormField
										control={form.control}
										name='apartmentNumber'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Квартира</FormLabel>
												<FormControl>
													<Input
														type='number'
														{...field}
														placeholder='Вкажи квартиру'
														onChange={e =>
															field.onChange(parseInt(e.target.value, 10))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</>
						)}
						<div className='flex justify-end gap-2 relative mt-4'>
							{/* BUTTON CANCEL */}
							<DialogClose asChild>
								<Button
									variant='link'
									onClick={() => form.reset()}
									type='button'
								>
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
			</DialogContent>
		</Dialog>
	)
}
