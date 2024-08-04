import { getCurrentUser } from '@/actions/user'
import { FeedBackForm } from '@/components/FeedbackForm/feedback-form'

export default async function ContactsPage() {
	const [currentUser] = await Promise.all([getCurrentUser()])
	return (
		<section className='container flex flex-row w-full'>
			<div className='w-1/2'>
				<h1>Contacts</h1>
			</div>
			<div className='w-1/2'>
				<FeedBackForm currentUser={currentUser} />
			</div>
		</section>
	)
}
