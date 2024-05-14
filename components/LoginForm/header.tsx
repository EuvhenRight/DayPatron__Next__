'use client'

interface Props {
	label?: string
}
export const Header = ({ label }: Props) => {
	return (
		<>
			<h3 className='font-bold'>Увійдіть до свого облікового запису</h3>
			<p className='text-sm py-1 text-center'>{label}</p>
		</>
	)
}
