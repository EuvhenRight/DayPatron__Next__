import { getCurrentUser } from '@/actions/user'
import { FeedBackForm } from '@/components/FeedbackForm/feedback-form'
import data from '@/lib/db/content.json'

export default async function ContactsPage() {
	const [currentUser] = await Promise.all([getCurrentUser()])
	const { ContentContactsPage } = data

	return (
		<section className='container lg:pt-5 relative flex flex-row w-full my-10'>
			<div className='w-1/2'>
				<h1 className='text-2xl font-bold'>{ContentContactsPage.page.title}</h1>
			</div>
			<div className='w-1/2'>
				<h1 className='text-2xl font-bold text-center'>
					{ContentContactsPage.form.title}
				</h1>
				<FeedBackForm currentUser={currentUser} />
			</div>
		</section>
	)
}
