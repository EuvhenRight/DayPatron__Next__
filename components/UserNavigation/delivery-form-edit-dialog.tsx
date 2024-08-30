import { deleteItemDelivery, editItemDelivery } from '@/actions/delivery'
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
import {
	DeliveryAddress,
	DeliveryBranch,
	ValidationSchema,
} from '@/lib/db/validation'

import { zodResolver } from '@hookform/resolvers/zod'
import { DeliveryItem } from '@prisma/client'
import { Pencil } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { TooltipInfo } from './tooltip'

interface Props {
	item: DeliveryItem
}

export const DeliveryFormEditDialog = ({ item }: Props) => {
	const [isOpen, setIsOpen] = useState(false)
	const [autoCityData, setAutoCityData] = useState<string>(item?.city!)
	const pathName = usePathname()
	// STATE AND HANDLERS
	const getValidationSchema = (typeOfDelivery: string) => {
		return typeOfDelivery === 'У відділення'
			? ValidationSchema.deliveryBranch
			: ValidationSchema.deliveryAddress
	}

	const getDefaultValues = (item: DeliveryItem) => {
		return item.typeOfDelivery === 'У відділення'
			? {
					typeOfDelivery: item?.typeOfDelivery || '',
					branchNumber: item?.branchNumber || '',
					city: item?.city || '',
			  }
			: {
					typeOfDelivery: item?.typeOfDelivery || '',
					city: item?.city || '',
					street: item?.street || '',
					houseNumber: item?.houseNumber || '',
					apartmentNumber: item?.apartmentNumber || '',
					additionNumber: item?.additionNumber || '',
					zipCode: item?.zipCode || '',
			  }
	}

	const getFormConfig = (item: DeliveryItem) => {
		return {
			resolver: zodResolver(getValidationSchema(item.typeOfDelivery)),
			defaultValues: getDefaultValues(item),
		}
	}

	const formConfig = getFormConfig(item)
	const form =
		useForm<
			z.infer<
				| typeof ValidationSchema.deliveryBranch
				| typeof ValidationSchema.deliveryAddress
			>
		>(formConfig)

	// DELIVERY DELETE ITEM
	const toggleDeleteItem = async () => {
		try {
			const deleteItem = deleteItemDelivery(item.id)
			await toast.promise(deleteItem, {
				loading: 'Зачекаємо...',
				success: 'Вашу інформацію видалено!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})
		} catch (error) {
			console.error('Щось пішло не так, спробуйте ще раз', error)
		}
	}

	const onSubmit = async (formConfig: DeliveryAddress | DeliveryBranch) => {
		try {
			// CREATE DELIVERY
			const deliveryItem = editItemDelivery(item.id, formConfig)

			// UPDATE DELIVERY
			await toast.promise(deliveryItem, {
				loading: 'Зачекаємо...',
				success: 'Вашу інформацію оновлено!',
				error: 'Щось пішло не так, спробуйте ще раз',
			})

			// RESET FORM
			form.reset()

			// CLOSE FORM
			setIsOpen(!isOpen)

			return await deliveryItem
		} catch (error) {
			console.error('Щось пішло не так, спробуйте ще раз', error)
		}
	}

	// USE EFFECT ADD CITY DATA TO FORM
	useEffect(() => {
		form.setValue('city', autoCityData)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoCityData])

	const blockInformation =
		'Не можна змінювати дані у цьому діалозі. Ви можете видалити цей тип доставки та створити новий.'

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className='hover:text-green-500 text-green-700 px-2'>
				<Pencil style={{ width: '20px', height: '20px' }} />
			</DialogTrigger>
			<DialogContent className='sm:max-w-[768px]'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} id='combobox'>
						{item.typeOfDelivery === 'У відділення' ? (
							<>
								{/* TYPE OF DELIVERY */}
								<FormField
									control={form.control}
									name='typeOfDelivery'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='flex justify-start items-center'>
												Тип доставки
												<TooltipInfo text={blockInformation} />
											</FormLabel>
											<FormControl>
												<Input type='text' {...field} disabled />
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
												<Input type='text' {...field} disabled />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
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
													placeholder='Вкажи назву населеного пункту'
													disabled
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
											<FormLabel>Тип доставки</FormLabel>
											<FormControl>
												<Input type='text' {...field} disabled />
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
						<div className='flex items-center justify-between gap-2 relative mt-4'>
							{/* BUTTON DELETE */}
							{pathName !== '/checkouts' ? (
								<DialogClose asChild>
									<Button
										variant='outlineRed'
										type='button'
										onClick={toggleDeleteItem}
									>
										Delete
									</Button>
								</DialogClose>
							) : (
								<div></div>
							)}
							<div>
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
								<Button
									type='button'
									variant='office'
									onClick={form.handleSubmit(onSubmit)}
								>
									Зберегти
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
