'use client'
interface Props {
	count: number
}

export const ReviewsCount = ({ count }: Props) => {
	return <div>{count}</div>
}
