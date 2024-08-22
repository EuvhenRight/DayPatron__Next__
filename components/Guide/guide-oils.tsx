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
export const TableOilsProducts = ({ products }: Props) => {
	const route = useRouter()
	const neutral = products.filter(product => product.category === 'Oil')
	const CLP = products.filter(product => product.category === 'CLP')
	const protect = products.filter(product => product.category === 'Protect-Oil')
	return (
		<div className='container'>
			<Table className='*:text-center lg:w-full w-[1400px] overflow-x-auto bg-slate-100 rounded'>
				<TableCaption className='text-center font-bold'>
					Посібник з вибору мастильних засобів DAYPATRON
				</TableCaption>
				<TableHeader>
					<TableRow className='*:text-black *:text-xs *:text-center *:py-2 *:px-1'>
						<TableHead>ЗАСІБ</TableHead>
						<TableHead>ЗМЕНШУЄ ТЕРТЯ</TableHead>
						<TableHead>ЗАПОБІГІЄ ЗНОШУВАННЮ</TableHead>
						<TableHead>НЕЙТРАЛІЗУЄ ПРОДУКТИ ГОРІННЯ</TableHead>
						<TableHead>ОЧИЩУЄ ПОМІННІ ЗАБРУДНЕННЯ</TableHead>
						<TableHead>ЗАХИСТ ВІД ВОЛОГИ</TableHead>
						<TableHead>ЗАХИСТ ВІД АТМОСФЕРНОГО ВПЛИВУ</TableHead>
						<TableHead>ЗАПОБІГАЄ ЇРЖІ ТА КОРОЗІЇ</TableHead>
						<TableHead>КОРОТКОСТРОКОВЕ ЗБЕРІГАННЯ</TableHead>
						<TableHead>ТРИВАЛЕ ЗБЕРІГАННЯ</TableHead>
						<TableHead>РЕКОМЕНДАЦІЇ ЩОДО ЗАСТОСУВАННЯ</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow
						className='*:relative  *:p-2 cursor-pointer hover:text-orange-600'
						onClick={() =>
							route.push('/products/6623b9b8783a5052f3ce52f6/details')
						}
					>
						<TableCell className='uppercase'>
							<GuideTooltip product={neutral} />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell className='w-min-[500px]'>
							Має відмінні проникаючі властивості. Нейтралізує залишки продуктів
							горіння. Захищає та змащує металеві поверхні.
						</TableCell>
					</TableRow>
					<TableRow
						onClick={() =>
							route.push('/products/6623b9b8783a5052f3ce52f7/details')
						}
						className='*:relative *:p-2 hover:text-yellow-600 cursor-pointer'
					>
						<TableCell className='uppercase'>
							{' '}
							<GuideTooltip product={protect} />
						</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell className='w-[500px]'>
							Тривале зберігання. Утворює воскову плівку. Захист металевих
							поверхонь від атмосферного впливу, вологи, солі, кислоти.
						</TableCell>
					</TableRow>
					<TableRow
						onClick={() =>
							route.push('/products/66854cad39b7c317fa603b6f/details')
						}
						className='*:relative  *:p-2 cursor-pointer hover:text-green-600'
					>
						<TableCell className='uppercase'>
							<GuideTooltip product={CLP} />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
						<TableCell>
							<Droplet className='absolute  text-orange-600 top-[40%] left-[40%]' />
						</TableCell>
						<TableCell></TableCell>
						<TableCell className='w-[500px]'>
							Очищує, нейтралізує залишки після пострілу. Змащує металеві, та
							рухомі частини зброї. Захищає метал від корозії, витісняє вологу.
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	)
}
