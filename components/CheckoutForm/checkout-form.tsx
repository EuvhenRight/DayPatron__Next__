'use client'
import { addOrderItem } from '@/actions/order'
import LoaderProductPage from '@/app/checkouts/loading'
import { CommentForm } from '@/components/CheckoutForm/comment-form'
import { DeliveryForm } from '@/components/CheckoutForm/delivery-form'
import { ExtraUserForm } from '@/components/CheckoutForm/extra-user-form'
import { InvoiceForm } from '@/components/CheckoutForm/invoce-form'
import { OrderSuccess } from '@/components/CheckoutForm/order-success'
import { PaymentForm } from '@/components/CheckoutForm/payment-form'
import { PaymentItem } from '@/components/CheckoutForm/payment-item'
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { ProfileForm } from '@/components/UserNavigation/profile-form'
import { orderItemScheme } from '@/lib/db/validation'
import {
	CartWithVariants,
	DeliveryWithItems,
	OrderFormInputs,
	OrderWithItems,
} from '@/lib/types/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface Props {
	cart?: CartWithVariants | null
	currentDelivery?: DeliveryWithItems | null
	currentUser?: User | null
	order?: OrderWithItems | null
	orders: OrderWithItems[] | null
}

export const CheckoutForm = ({
	cart,
	currentDelivery,
	currentUser,
	order,
	orders,
}: Props) => {
	const [payment, setPayment] = useState<string>('Карткою')
	const [makeOrder, setMakeOrder] = useState<boolean>(false)
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	const formMethods = useForm<z.infer<typeof orderItemScheme>>({
		resolver: zodResolver(orderItemScheme),
		defaultValues: {
			extra_user: {
				email: '',
				firstName: '',
				lastName: '',
				phone: '',
			},
			profile: {
				firstName: currentUser?.firstName || '',
				lastName: currentUser?.lastName || '',
				email: currentUser?.email || '',
				phone: currentUser?.phone || '',
			},
			payment: '',
			comment: '',
			address: '',
			cartId: cart?.id,
		},
	})

	const {
		formState: { errors },
		handleSubmit,
		control,
		trigger,
		setError,
		clearErrors,
	} = formMethods

	useEffect(() => {
		const { firstName, lastName, phone } = formMethods.getValues('profile')

		if (firstName && lastName && phone) {
			clearErrors('profile')
		}
	}, [errors, formMethods, clearErrors])

	const onSubmit = async (data: OrderFormInputs) => {
		startTransition(() => {
			addOrderItem(data)
		})
		setMakeOrder(true)
		router.refresh()
	}

	if (pending) {
		return <LoaderProductPage />
	}

	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2'>
			{!makeOrder ? (
				<>
					<div className='flex justify-between items-center'>
						<button
							type='button'
							onClick={() => router.back()}
							className='hover:-translate-x-1 transition cursor-pointer'
						>
							<ChevronLeft size={30} />
						</button>
						<h2 className='text-xl text-center font-bold my-2'>
							Оформлення замовлення
						</h2>
						<div></div>
					</div>
					<FormProvider {...formMethods}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='grid grid-cols-1 grid-rows-auto gap-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4'
						>
							<div className='row-start-2 row-span-auto lg:col-span-2 lg:row-span-2 lg:row-start-1'>
								{/* PROFILE */}
								<FormField
									control={control}
									name='profile'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<ProfileForm
													onChange={field.onChange}
													currentUser={currentUser!}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* EXTRA USER */}
								<FormField
									name='extra_user'
									render={({ field }) => (
										<FormItem>
											<ExtraUserForm onChange={field.onChange} />
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='row-start-3 row-span-auto lg:col-span-2 lg:row-span-2 lg:row-start-3'>
								{/* PAYMENT */}
								<FormField
									control={control}
									name='payment'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<PaymentForm
													onChange={field.onChange}
													payment={payment}
													setPayment={setPayment}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* DELIVERY */}
								<FormField
									control={control}
									name='address'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<DeliveryForm
													onChange={field.onChange}
													currentDelivery={currentDelivery!}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* COMMENT */}
								<FormField
									control={control}
									name='comment'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<CommentForm onChangeText={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							{/* CART */}
							<div className='bg-zinc-100 rounded-md p-4 mt-2 overflow-auto max-h-[446px] sm:max-h-[446px] row-start-1 row-span-auto lg:row-span-2 lg:col-start-3 lg:row-start-1'>
								{cart?.items.map((item, index) => (
									<PaymentItem key={index} item={item} />
								))}
							</div>
							<div>
								<FormField
									control={control}
									name='cartId'
									render={({ field }) => (
										<FormItem className='row-start-4 row-span-auto lg:col-start-3 lg:row-start-3 lg:row-span-1'>
											<FormControl>
												<InvoiceForm cart={cart} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{Object.keys(errors).length > 0 && (
									<p className='text-sm font-medium text-red-500 dark:text-red-900 mt-2'>
										* Заповніть всі обов&apos;язкові поля
									</p>
								)}
							</div>
						</form>
					</FormProvider>
				</>
			) : (
				<OrderSuccess />
			)}
		</section>
	)
}
