import { CircleX } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

interface ZoomProps {
	imageUrl: string
	onClose: () => void
	handlePrevClick: () => void
	handleNextClick: () => void
}

export const Zoom: React.FC<ZoomProps> = ({
	imageUrl,
	onClose,
	handlePrevClick,
	handleNextClick,
}) => {
	const [isZoomedIn, setIsZoomedIn] = useState(false) // State to manage zoom-in or not
	const [scrolling, setScrolling] = useState(false) // State to track scroll interaction

	const handleImageClick = () => {
		// Toggle zoom in/out on image click
		setIsZoomedIn(prev => !prev)
	}

	return (
		<div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-100'>
			<div className='absolute top-1/2 left-4 right-4 flex justify-between'>
				<AiOutlineLeft
					className='lg:text-white text-4xl ml-5 z-10 rounded-full bg-white lg:bg-transparent hover:translate-x-1 transition-transform'
					onClick={handlePrevClick}
				/>
				<AiOutlineRight
					className='lg:text-white text-4xl ml-5 z-10 rounded-full bg-white lg:bg-transparent hover:-translate-x-1 transition-transform'
					onClick={handleNextClick}
				/>
			</div>
			<button
				onClick={onClose}
				className='absolute top-4 right-4 text-white text-2xl z-10'
			>
				<CircleX className='w-8 h-8 text-white' />
			</button>
			<div
				className={`overflow-y-auto flex items-center justify-center ${
					isZoomedIn ? 'max-h-full' : 'max-h-screen'
				}`}
				style={{ touchAction: 'none' }} // Disable touch actions to prevent unwanted scrolling
			>
				<Image
					src={imageUrl}
					alt='Zoomed image'
					width={isZoomedIn ? 1200 : 800} // Adjust size on zoom
					height={isZoomedIn ? 1200 : 800}
					className={`cursor-zoom-in object-contain transition-transform duration-300 ${
						isZoomedIn ? 'scale-150' : 'scale-100' // Apply scaling on zoom-in
					}`}
					onClick={handleImageClick}
				/>
			</div>
		</div>
	)
}