import { CircleX } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

interface ZoomProps {
	imageUrl: string
	onClose: () => void
	handlePrevClick: () => void
	handleNextClick: () => void
	arrowToggle: number
	countImages: number
}

export const Zoom: React.FC<ZoomProps> = ({
	imageUrl,
	onClose,
	handlePrevClick,
	handleNextClick,
	arrowToggle,
	countImages,
}) => {
	const [isZoomedIn, setIsZoomedIn] = useState(false) // State to manage zoom-in or not
	const containerRef = useRef<HTMLDivElement | null>(null)
	const touchStartX = useRef<number | null>(null)
	const touchStartY = useRef<number | null>(null)

	useEffect(() => {
		// Disable page scrolling when zoom modal is open
		document.body.style.overflow = 'hidden'

		return () => {
			// Cleanup when the modal is closed
			document.body.style.overflow = 'auto'
		}
	}, [])

	const handleImageClick = () => {
		// Toggle zoom in/out on image click
		setIsZoomedIn(prev => !prev)
	}

	const handleTouchStart = (e: React.TouchEvent) => {
		if (isZoomedIn) {
			touchStartX.current = e.touches[0].clientX
			touchStartY.current = e.touches[0].clientY
		}
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		if (isZoomedIn && containerRef.current) {
			const touchEndX = e.touches[0].clientX
			const touchEndY = e.touches[0].clientY

			if (touchStartX.current !== null && touchStartY.current !== null) {
				const touchDeltaX = touchStartX.current - touchEndX
				const touchDeltaY = touchStartY.current - touchEndY

				containerRef.current.scrollLeft += touchDeltaX
				containerRef.current.scrollTop += touchDeltaY

				// Update the starting positions for the next move
				touchStartX.current = touchEndX
				touchStartY.current = touchEndY
			}
		}
	}

	return (
		<div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-100'>
			<div className='absolute top-1/2 z-10 left-4 right-4 flex justify-between'>
				<button onClick={handlePrevClick}>
					<AiOutlineLeft
						className={`lg:text-white text-4xl ml-5 z-50 rounded-full bg-white lg:bg-transparent hover:translate-x-1 transition-transform ${
							arrowToggle === 0 ? 'hidden' : ''
						}`}
					/>
				</button>
				<button onClick={handleNextClick}>
					<AiOutlineRight
						className={`lg:text-white text-4xl ml-5 z-50 rounded-full bg-white lg:bg-transparent hover:-translate-x-1 transition-transform ${
							arrowToggle == countImages - 1 ? 'hidden' : ''
						}`}
					/>
				</button>
			</div>
			<button
				onClick={onClose}
				className='absolute top-4 right-4 text-white text-2xl z-10'
			>
				<CircleX className='w-8 h-8 text-white' />
			</button>
			<div
				className={`overscroll-contain touch-auto flex items-center justify-center ${
					isZoomedIn ? 'max-h-full' : 'max-h-screen'
				}`}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
			>
				<Image
					src={imageUrl}
					alt='Zoomed image'
					width={isZoomedIn ? 1200 : 800} // Adjust size on zoom
					height={isZoomedIn ? 1200 : 800}
					className={`cursor-zoom-in object-contain transition-transform overscroll-contain duration-300 ${
						isZoomedIn ? 'scale-150' : 'scale-100' // Apply scaling on zoom-in
					}`}
					onClick={handleImageClick}
				/>
			</div>
		</div>
	)
}
