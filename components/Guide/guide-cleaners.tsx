'use client'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Product } from '@prisma/client'
import { Droplet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { GuideTooltip } from './guide-tooltip'

interface Props {
	products: Product[]
}
export const TableCleanerProducts = ({ products }: Props) => {
	const route = useRouter()
	const carbon = products.filter(
		product => product.category === 'Carbon-Cleaner'
	)
	const copper = products.filter(
		product => product.category === 'Copper-Cleaner'
	)
	const liquidator = products.filter(
		product => product.category === 'Liquidator'
	)

	return (
		<>
			<Table className='*:text-center lg:w-full w-[1000px] overflow-x-auto bg-slate-100 rounded my-20'>
				<TableCaption className='text-center font-bold'>
					Посібник з вибору чистячих засобів DAYPATRON
				</TableCaption>
				<TableHeader>
					<TableRow className='*:text-black *:text-xs *:text-center *:p-2'>
						<TableHead>ЗАСІБ</TableHead>
						<TableHead>ВИДАЛЯЄ НАГАР</TableHead>
						<TableHead>ВИДАЛЯЄ МІДЬ</TableHead>
						<TableHead>ВИДАЛЯЄ ПЛАСТИК</TableHead>
						<TableHead>ВИДАЛЯЄ СВИНЕЦЬ</TableHead>
						<TableHead>ВИДАЛЯЄ ПРОДУКТИ ГОРІННЯ</TableHead>
						<TableHead>ЗНИЩУЄ ТОМПАК</TableHead>
						<TableHead>РЕКОМЕНДАЦІЇ ЩОДО ЗАСТОСУВАННЯ</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow
						className='*:relative  *:p-2 cursor-pointer hover:text-sky-500'
						onClick={() => {
							route.push('/products/6623b9b8783a5052f3ce52f8/details')
						}}
					>
						<TableCell className='uppercase'>
							<GuideTooltip product={carbon} />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell className='w-[500px]'>
							Миттєво знищує залишки нагару, мастила та змазки, пластику,
							томпаку на всіх металевих поверхнях зброї. Не горить та без
							запаху.
						</TableCell>
					</TableRow>
					<TableRow
						className='*:relative  *:p-2 cursor-pointer hover:text-sky-500'
						onClick={() => {
							route.push('/products/6623b9b8783a5052f3ce52f9/details')
						}}
					>
						<TableCell className='uppercase'>
							<GuideTooltip product={copper} />
						</TableCell>
						<TableCell></TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell className='w-[500px]'>
							Миттєво знищує залишки міді та її сполуки в стволі будь-якої зброї
							будь-якого калібру. Має індикатор чистоти! Не горить, без аміаку
							та запаху.
						</TableCell>
					</TableRow>
					<TableRow
						onClick={() => {
							route.push('/products/6623b9b8783a5052f3ce52fa/details')
						}}
						className='*:relative  *:p-2 hover:text-neutral-500 cursor-pointer'
					>
						<TableCell className='uppercase'>
							<GuideTooltip product={liquidator} />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute top-[40%] lg:top-[20%] text-zinc-400 left-[40%]' />
						</TableCell>
						<TableCell className='w-[500px]'>
							Потужно та миттєво видаляє <b>ВСІ</b> забруднення встволі, будь
							якої зброї і будь якого калібру. Має індикатор чистоти! Не горить,
							без аміаку та запаху.
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	)
}
