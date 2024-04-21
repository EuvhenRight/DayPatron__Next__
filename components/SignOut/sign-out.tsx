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
		<>
			<AlertDialog>
				<AlertDialogTrigger>Logout</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure want to logout?</AlertDialogTitle>
						<AlertDialogDescription>
							You will be logout of your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className={buttonVariants({ variant: 'office' })}
							onClick={handleSignOut}
						>
							Yes
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
