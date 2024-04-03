import { useLogOut } from '@/lib/hooks/useLogout'
import { signOut, useSession } from 'next-auth/react'

const SignOut = () => {
	const { isModalOpen, handleClose } = useLogOut()
	const session = useSession()

	const handleSignOut = () => {
		signOut()
	}

	return (
		<>
			<dialog className='modal' open={isModalOpen}>
				<div className='modal-box bg-base-200 shadow-sm'>
					<form method='dialog'>
						{/* if there is a button in form, it will close the modal */}
						<button
							className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
							onClick={handleClose}
						>
							✕
						</button>
					</form>
					<h3 className='font-bold text-lg'>Sign Out</h3>
					<p className='py-4'>Are you sure you want to sign out?</p>
					<div className='modal-action'>
						<button
							className='btn btn-primary btn-sm btn-active rounded-md'
							onClick={handleSignOut}
						>
							Sign Out
						</button>
					</div>
				</div>
			</dialog>
		</>
	)
}

export default SignOut
