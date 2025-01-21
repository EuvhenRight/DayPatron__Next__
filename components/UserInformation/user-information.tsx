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
import { formatPriceUa } from '@/lib/services/format'
import { OrderWithItemsWithVariants } from '@/lib/types/types'

interface Props {
	orders?: OrderWithItemsWithVariants[] | null
}
export const UserInformation = ({ orders }: Props) => {
	// COUNTS INVOICES IN TABLE
	const getTotal = orders?.reduce((a, b) => a + b.subTotal, 0)
	const getTotalItems = orders?.reduce((a, b) => a + b.itemsTotal, 0)

	return (
		<Table>
			<TableCaption>Замовлення</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className='text-center w-[100px] p-1 lg:p-4'>
						Дата
					</TableHead>
					<TableHead className='text-center w-[200px]'>Спосіб оплати</TableHead>
					<TableHead className='w-[500px]'>Товари</TableHead>
					<TableHead className='w-1/6'>Коментар</TableHead>
					<TableHead className='text-center w-[200px]'>
						Кількість товарів
					</TableHead>
					<TableHead className='text-center w-[100px]'>Сума</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/* ORDERS */}
				{orders?.map(order => (
					<TableRow key={order.id}>
						{/* DATE */}
						<TableCell className='font-medium text-center'>
							{order.createdAt.getDate()}/{order.createdAt.getMonth() + 1}/
							{order.createdAt.getFullYear()}
						</TableCell>
						{/* PAYMENT */}
						<TableCell className='text-center'>
							{order.payment === 'PAIMENTBYCARD' ? 'Карткою' : 'Післяплатою'}
						</TableCell>
						<TableCell>
							{/* ITEMS */}
							{order.item.map(item => {
								return (
									<div className='w-[500px]' key={item.id}>
										{item.variant.name} - {item.variant.volume} -
										{formatPriceUa(item.variant.original_price)} -
										{item.quantity} шт.
									</div>
								)
							})}
						</TableCell>
						{/* COUNTS */}
						<TableCell className='w-1/6'>
							{order.comment} {order.bonus && 'Бонус: ' + order.bonus}
						</TableCell>
						<TableCell className='text-center'>{order.itemsTotal}</TableCell>
						<TableCell
							className={`text-right ${order.bonus && 'text-orange-600'}`}
						>
							{formatPriceUa(order.subTotal)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={4} className='text-right font-bold'>
						Всього
					</TableCell>
					{/* TOTAL COUNTS */}
					<TableCell className='text-center'>{getTotalItems} шт.</TableCell>
					<TableCell className='text-right'>
						{/* TOTAL IN UAH */}
						{formatPriceUa(getTotal || 0)}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}
