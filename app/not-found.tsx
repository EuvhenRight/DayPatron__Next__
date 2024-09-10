// pages/404.js

import Link from 'next/link'

const Custom404 = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
			<h1 className='text-4xl font-black text-gray-800 mb-4'>Помилка 404</h1>
			<p className='text-lg text-gray-600 mb-2'>
				На жаль, сторінку, яку ви шукаєте, не знайдено.
			</p>
			<p className='text-md text-red-600 italic mb-6'>
				Попередження: Ви потрапили на сторінку, яка не існує. Будь ласка,
				перевірте URL-адресу або поверніться на головну сторінку.
			</p>
			<Link href='/' className='hover:underline mt-10'>
				Повернутися на головну сторінку
			</Link>
		</div>
	)
}

export default Custom404
