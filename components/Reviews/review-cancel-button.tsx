import { Button } from '../ui/button'

interface Props {
	labelCancel: string
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const ReviewCancelButton = ({
	labelCancel,
	setEdit,
	setOpen,
}: Props) => {
	const onToggleClick = () => {
		setEdit(false)
		setOpen(false)
	}
	return (
		<Button
			variant='outline'
			onClick={onToggleClick}
			size='sm'
			className='shadow-lg text-yellow-600 border border-yellow-600 gap-2 hover:scale-105 transition-all ease-in-out duration-300 font-bold my-4 mr-5'
		>
			{labelCancel}
		</Button>
	)
}
