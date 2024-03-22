'use client'

interface HeaderProps {
	label?: string
}

export const Header: React.FC<HeaderProps> = ({ label }) => {
	return (
		<>
			<h3 className='font-bold'>Увійдіть до свого облікового запису</h3>
			<p className='text-sm py-1 text-center'>{label}</p>
		</>
	)
}
