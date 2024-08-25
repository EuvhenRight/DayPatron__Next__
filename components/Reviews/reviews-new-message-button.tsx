'use client'
import { Button } from '../ui/button'

interface Props {
	label: string
}
export const ReviewsNewMessageButton = ({ label }: Props) => {
	return (
		<Button variant='outline' size='sm'>
			{label}
		</Button>
	)
}
