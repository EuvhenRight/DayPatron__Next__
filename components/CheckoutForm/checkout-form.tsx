'use client'
import { addOrderItem } from '@/actions/order'
import { CommentForm } from '@/components/CheckoutForm/comment-form'
import { DeliveryForm } from '@/components/CheckoutForm/delivery-form'
import { ExtraUserForm } from '@/components/CheckoutForm/extra-user-form'
import { InvoiceForm } from '@/components/CheckoutForm/invoce-form'
import { PaymentForm } from '@/components/CheckoutForm/payment-form'
import {
	Form,
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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PaymentItem } from './payment-item'

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
	const form = useForm<z.infer<typeof orderItemScheme>>({
		resolver: zodResolver(orderItemScheme),
		defaultValues: {
			extra_user: {
				email: '',
				firstName: '',
				lastName: '',
				phone: '',
			},
			payment: '',
			comment: '',
			address: '',
			cartId: cart?.id,
		},
	})

	const onSubmit = (data: OrderFormInputs) => {
		addOrderItem(data)
	}
	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid grid-cols-1 grid-rows-auto gap-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4'
				>
					<div className='row-start-2 row-span-auto lg:col-span-2 lg:row-span-2 lg:row-start-1'>
						{/* PROFILE */}
						<ProfileForm currentUser={currentUser!} />
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
							control={form.control}
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
							control={form.control}
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
							control={form.control}
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
					<div className='bg-zinc-100 rounded-md p-4 my-2 overflow-auto max-h-[450px] sm:max-h-[450px] row-start-1 row-span-auto lg:row-span-2 lg:col-start-3 lg:row-start-1'>
						{cart?.items.map((item, index) => (
							<PaymentItem key={index} item={item} />
						))}
					</div>
					<div>
						<FormField
							control={form.control}
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
						{/* Error Message */}
						{Object.keys(form.formState.errors).length > 0 && (
							<p className='text-red-500 mt-2'>* Перевірте введені дані</p>
						)}
					</div>
				</form>
			</Form>
		</section>
	)
}
