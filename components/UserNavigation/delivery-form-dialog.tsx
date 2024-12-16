import { addItemDelivery } from '@/actions/delivery'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
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
import { RadioTypesOfDelivery } from '@/components/UserNavigation/radio-types-of-delivery'
import {
	DeliveryAddress,
	DeliveryBranch,
	ValidationSchema,
} from '@/lib/db/validation'

import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { ComboboxCityData } from './city-nova-poshta-data'
import { ComboboxDivisionData } from './division-nova-poshta-data copy'
import { TooltipInfo } from './tooltip'

interface Props {
	setTypeOfDelivery: React.Dispatch<React.SetStateAction<string>>
	typeOfDelivery: string
}

export const DeliveryFormDialog: React.FC<Props> = ({
	typeOfDelivery,
	setTypeOfDelivery,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [autoCityData, setAutoCityData] = useState<string>('')

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
					city: '',
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

	const onSubmit = async (formConfig: DeliveryAddress | DeliveryBranch) => {
		try {
			// CREATE DELIVERY
			const deliveryItem = addItemDelivery(formConfig)

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

	// EFFECT AND HANDLERS
	useEffect(() => {
		if (isOpen) {
			setTypeOfDelivery('')
			form.reset(getDefaultValues(''))
		}
	}, [isOpen, setTypeOfDelivery, form])

	const blockInformation = 'Перший крок: спочатку виберіть населений пункт'

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className='hover:text-green-500 text-green-700 px-2'>
				+ Додати
			</DialogTrigger>
			<DialogContent
				aria-labelledby={'delivery-form-dialog'}
				aria-describedby={'delivery-form-dialog-description'}
				className='w-full sm:max-w-[768px] z-40'
			>
				<DialogTitle className='hidden'>Title for Screen Readers</DialogTitle>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} id='combobox'>
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
								{/* CITY */}
								<FormField
									control={form.control}
									name='city'
									render={({ field }) => (
										<FormItem className='mt-10'>
											<FormLabel>Населений пункт</FormLabel>
											<FormControl>
												<ComboboxCityData
													{...field}
													onChange={field.onChange}
													setAutoCityData={setAutoCityData}
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
										<FormItem className='w-full'>
											<FormLabel>Відділення</FormLabel>
											<TooltipInfo text={blockInformation} />
											<FormControl>
												<ComboboxDivisionData
													{...field}
													onChange={field.onChange}
													autoCityData={autoCityData}
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
									onClick={() => {
										setAutoCityData('')
										form.reset()
									}}
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
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
