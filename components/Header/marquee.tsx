import Image from 'next/image'

export const Marquee: React.FC = () => {
	const phrase = 'Зроблено з гордістю в Україні' // Update with your image path

	return (
		<div className='overflow-hidden whitespace-nowrap'>
			<div className='flex items-center animate-marquee justify-between'>
				<Image
					src='/images/ukraine.svg'
					priority={true}
					alt='Marquee'
					width={75}
					height={50}
					className='mx-4 h-8 aspect-auto'
				/>
				<span className='mx-4 text-white'>{phrase}</span>
				<Image
					src='/images/ukraine.svg'
					priority={true}
					alt='Marquee'
					width={75}
					height={50}
					className='mx-4 h-8 aspect-auto'
				/>
			</div>
		</div>
	)
}
