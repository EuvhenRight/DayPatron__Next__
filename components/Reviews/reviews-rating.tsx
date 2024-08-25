'use client'
interface Props {
	rating: number
}
export const ReviewsRating = ({ rating }: Props) => {
	return <div>{rating}</div>
}
