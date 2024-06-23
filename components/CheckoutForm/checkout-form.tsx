'use client'
import { addOrderItem } from '@/actions/order'
import { CommentForm } from '@/components/CheckoutForm/comment-form'
import { DeliveryForm } from '@/components/CheckoutForm/delivery-form'
import { ExtraUserForm } from '@/components/CheckoutForm/extra-user-form'
import { InvoiceForm } from '@/components/CheckoutForm/invoce-form'
import { PaymentForm } from '@/components/CheckoutForm/payment-form'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
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
				<form onSubmit={form.handleSubmit(onSubmit)} className='flex'>
					<div className='w-2/3 px-2'>
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
					<div className='w-1/3 p-2 sticky top-5'>
						{/* CART */}
						<FormField
							control={form.control}
							name='cartId'
							render={({ field }) => (
								<FormItem>
									<FormLabel></FormLabel>
									<FormControl>
										<InvoiceForm cart={cart} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className='w-full' type='submit' variant='office'>
							Оформити замовлення
						</Button>
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
