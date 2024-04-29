'use client'
import StarRating from 'react-star-ratings'
interface Props {
	currentRating: number
}

export const RatingProducts: React.FC<Props> = ({ currentRating }) => {
	return (
		<div>
			<StarRating
				rating={currentRating}
				starRatedColor='orange'
				starDimension='26px'
				starSpacing='5px'
			/>
		</div>
	)
}
