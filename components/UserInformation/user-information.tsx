'use client'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { formatPriceUa } from '@/lib/db/format'
import { OrderForm } from '@/lib/types/types'

interface Props {
	orders: OrderForm[] | null
}
export const UserInformation = ({ orders }: Props) => {
	const getTotal = orders?.reduce((a, b) => a + b.subTotal, 0)
	console.log(orders)
	return (
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className='text-center w-[100px] p-1 lg:p-4'>
						Дата
					</TableHead>
					<TableHead className='text-center w-[200px]'>Спосіб оплати</TableHead>
					<TableHead className='w-[500px] lg:w-1/3'>Товари</TableHead>
					<TableHead className='w-1/6 lg:w-1/6'>Коментар</TableHead>
					<TableHead className='text-center w-[200px]'>
						Кількість товарів
					</TableHead>
					<TableHead className='text-center w-[100px]'>Сума</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders?.map(order => (
					<TableRow key={order.id}>
						<TableCell className='font-medium text-center'>
							{order.createdAt.getDate()}/{order.createdAt.getMonth() + 1}/
							{order.createdAt.getFullYear()}
						</TableCell>
						<TableCell className='text-center'>
							{order.payment === 'PAIMENTBYCARD' ? 'Карткою' : 'Післяплатою'}
						</TableCell>
						<TableCell>
							{order.item.map(item => {
								return (
									<div className='w-[500px] lg:w-1/3' key={item.id}>
										{item.variant.name} - {item.variant.volume} -
										{formatPriceUa(item.variant.original_price)} -
										{item.quantity} шт.
									</div>
								)
							})}
						</TableCell>
						<TableCell className='w-1/6 lg:w-1/6'>{order.comment}</TableCell>
						<TableCell className='text-center'>{order.itemsTotal}</TableCell>
						<TableCell className='text-center'>
							{formatPriceUa(order.subTotal)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={5} className='text-right font-bold'>
						Всього
					</TableCell>
					<TableCell className='text-right'>
						{formatPriceUa(getTotal || 0)}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}
