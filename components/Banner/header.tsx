'use client'

interface Props {
	label?: string
}
export const Header = ({ label }: Props) => {
	return (
		<>
			<h1 className='font-bold text-2xl text-white'>
				Отримайте знижку 20% на ваше перше замовлення!
			</h1>
			<p className='text-sm py-1 text-center text-white'>{label}</p>
		</>
	)
}
