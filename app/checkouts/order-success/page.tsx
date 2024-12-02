import { rubikDirt } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Metadata } from 'next'
import { ComebackButton } from './comeback-button'

export const metadata: Metadata = {
	title: 'Замовлення успішне',
	description:
		'Дякуємо за ваше замовлення. Ви отримаєте електронний лист з деталями вашого замовлення.',
}

export default function OrderSuccess() {
	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full bg-white shadow-md rounded-xl p-6 space-y-6'>
				<h1
					className={cn(
						rubikDirt.className,
						'text-2xl text-center tracking-tight mt-1 uppercase opacity-65'
					)}
				>
					Дякуємо за ваше замовлення.
				</h1>
				<p className='text-neutral-600 text-center'>
					Ви отримаєте електронний лист з деталями вашого замовлення.
				</p>
				<p className='text-neutral-600 text-center'>
					Будь ласка, перевірте папку зі спамом, якщо ви не отримали електронний
					лист.
				</p>
			</div>
			<ComebackButton />
		</div>
	)
}
