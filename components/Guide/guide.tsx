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
import { Droplet } from 'lucide-react'
import Link from 'next/link'

export const Guide = () => {
	return (
		<div className='container'>
			<Table className='*:text-center lg:w-full w-[1000px] overflow-x-auto bg-slate-100 rounded my-24'>
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
					<TableRow className='*:relative  *:p-2'>
						<TableCell>
							<Link
								href='/products/6623b9b8783a5052f3ce52f9/details'
								className='hover:text-sky-500'
							>
								ЗНИЩУВАЧ НАГАРУ
							</Link>
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
					<TableRow className='*:relative  *:p-2'>
						<TableCell>
							<Link
								href='/products/6623b9b8783a5052f3ce52f8/details'
								className='hover:text-sky-500'
							>
								ЗНИЩУВАЧ МІДІ
							</Link>
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
					<TableRow className='*:relative  *:p-2'>
						<TableCell>
							<Link
								href='/products/6623b9b8783a5052f3ce52fa/details'
								className='hover:text-gray-500'
							>
								ОЧИСНИК СТВОЛА
							</Link>
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
					<TableRow className='*:relative  *:p-2'>
						<TableCell>
							<Link
								href='/products/6623b9b8783a5052f3ce52f6/details'
								className='hover:text-orange-600'
							>
								НЕЙТРАЛЬНЕ, СИНТЕТИЧНЕ МАСЛО
							</Link>
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
					<TableRow className='*:relative *:p-2'>
						<TableCell>
							<Link
								href='/products/6623b9b8783a5052f3ce52f7/details'
								className='hover:text-yellow-600'
							>
								ЗАХИСТ ВІД ІРЖІ ТА КОРОЗІЇ
							</Link>
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
					<TableRow className='*:relative  *:p-2'>
						<TableCell>
							<Link
								href='/products/66854cad39b7c317fa603b6f/details'
								className='hover:text-green-600'
							>
								УНІВЕРСАЛЬНЕ МАСЛО 3 В 1
							</Link>
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
