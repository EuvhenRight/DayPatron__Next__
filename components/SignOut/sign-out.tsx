import { logOut } from '@/actions/logout'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const LogOutModal = () => {
	const router = useRouter()
	const [error, setError] = useState<string | null>(null)

	const handleSignOut = async () => {
		try {
			await logOut()
			router.push('/')
		} catch (err) {
			setError(
				'Виникла помилка при виxоді з системи. Будь ласка, спробуйте ще раз.'
			)
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger>Вийти з системи</AlertDialogTrigger>
			<AlertDialogContent
				aria-labelledby='alert-dialog'
				aria-describedby='alert-dialog-description'
			>
				<AlertDialogHeader>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<AlertDialogTitle>Ви дійсно хочете вийти?</AlertDialogTitle>
					<AlertDialogDescription>
						Ви вийдете зі свого облікового запису.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Скасувати</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants({ variant: 'office' })}
						onClick={handleSignOut}
					>
						Вийти
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
