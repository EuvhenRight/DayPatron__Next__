'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

export const MissionInfo = () => {
	const router = useRouter()
	const toggleButton = () => {
		router.push('/about')
	}
	return (
		<div className='w-full flex flex-col items-center justify-center'>
			<div>
				<h1 className='text-3xl font-bold px-4 bg-neutral-700 rounded-t-lg w-full sm:w-64 h-10 text-center text-white rounded-b--lg'>
					[ Наша місія ]
				</h1>
				<p className='text-center text-lg rounded-b-lg bg-neutral-700 sm:rounded-r-lg  p-4 text-white'>
					DAY Patron – ідеальний супутник для тих, хто цінує бездоганність та
					догляд за своєю зброєю. Ми віримо, що кожен заслуговує використовувати
					продукти вищого класу, і наша ціль – зробити це доступним для всіх.
				</p>
			</div>
			<Button
				variant={'destructive'}
				size={'lg'}
				className='m-5 p-2 text-white hover:scale-110 transition-all ease-in-out duration-300'
				onClick={toggleButton}
			>
				Дізнатися більше
			</Button>
		</div>
	)
}
