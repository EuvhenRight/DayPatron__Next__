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

export const LogOutModal = () => {
	const router = useRouter()

	const handleSignOut = () => {
		logOut()
		router.push('/')
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger>Вийти з системи</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
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
