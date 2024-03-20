interface RatingProps {
	rating: number
}

const RatingInfo: React.FC<RatingProps> = ({ rating }) => {
	// RATING CREATED COMPONENT
	const stars = Array.from({ length: 5 })
	// SET UP RATING FULL NUMBER
	const fullStars = Math.round(rating)
	return (
		<div className='rating'>
			{stars.map((_, index) => (
				<input
					key={index}
					type='radio'
					name='rating-2'
					className='mask mask-star-2 bg-orange-400'
					checked={index < fullStars}
					onChange={() => {}} // Dummy onChange handler
				/>
			))}
		</div>
	)
}

export default RatingInfo
