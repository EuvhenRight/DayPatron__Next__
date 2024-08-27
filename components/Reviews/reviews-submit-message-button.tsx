'use client'
import { Button } from '../ui/button'

interface Props {
	labelSubmit: string
}
export const ReviewsSubmitMessageButton = ({ labelSubmit }: Props) => {
	return (
		<Button
			variant='outline'
			type='submit'
			size='sm'
			className='shadow-lg text-green-600 border border-green-600 gap-2 hover:scale-105 transition-all ease-in-out duration-300 font-bold my-4 mr-5'
		>
			{labelSubmit}
		</Button>
	)
}
