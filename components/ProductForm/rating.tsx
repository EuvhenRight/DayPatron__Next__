'use client'
import dynamic from 'next/dynamic'
interface Props {
	currentRating: number
}

export const RatingProducts = ({ currentRating }: Props) => {
	const NoSSRStarRating = dynamic(() => import('react-star-ratings'), {
		ssr: false,
	})

	return (
		<div>
			<NoSSRStarRating
				rating={currentRating}
				starRatedColor='orange'
				starDimension='26px'
				starSpacing='5px'
			/>
		</div>
	)
}
