'use client'

interface Props {
	label?: string
}
export const Header = ({ label }: Props) => {
	return (
		<>
			<h1 className='text-[32px] text-white text-center'>
				Отримайте знижку 20% на ваше перше замовлення!
			</h1>
			<p className='text-md font-light py-5 text-center text-white'>{label}</p>
		</>
	)
}
