'use client'
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
import { CartWithVariants, DeliveryWithItems } from '@/lib/types/types'
import { User } from '@prisma/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
	cart?: CartWithVariants | null
	currentDelivery?: DeliveryWithItems | null
	currentUser?: User | null
}

export const CheckoutForm = ({ cart, currentDelivery, currentUser }: Props) => {
	const form = useForm({
		defaultValues: {
			extra_user: '',
			profile: currentUser || '',
			payment: '',
			comment: '',
			delivery: '',
			cart: cart || null,
		},
	})
	const [payment, setPayment] = useState('Карткою')

	const onSubmit = (data: any) => {
		console.log(data)
	}

	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='flex'>
					<div className='w-2/3 p-2'>
						{/* PROFILE */}
						<FormField
							control={form.control}
							name='profile'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Test</FormLabel>
									<FormControl>
										<ProfileForm currentUser={currentUser!} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* EXTRA USER */}
						<FormField
							control={form.control}
							name='extra_user'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Test</FormLabel>
									<FormControl>
										<ExtraUserForm onChange={field.onChange} />
									</FormControl>
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
									<FormLabel>Test</FormLabel>
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
							name='delivery'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Test</FormLabel>
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
						<Button type='submit'>Далі</Button>
					</div>
					<div className='w-1/3 p-2'>
						{/* CART */}
						<FormField
							control={form.control}
							name='cart'
							render={({ field }) => (
								<FormItem className='sticky top-0'>
									<FormLabel></FormLabel>
									<FormControl>
										<InvoiceForm cart={cart} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
		</section>
	)
}
