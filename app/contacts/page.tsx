import { getCurrentUser } from '@/actions/user'
import { ContactsComponent } from '@/components/Contacts/contacts-component'
import { GoogleMap } from '@/components/Contacts/googleMap'
import { FeedBackForm } from '@/components/FeedbackForm/feedback-form'
import data from '@/lib/db/content.json'
import { contactData } from '@/lib/services/contacts'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'DayPatron__Контакти',
	description: 'Приєднуйтесь до нас',
}

export default async function ContactsPage() {
	const [currentUser] = await Promise.all([getCurrentUser()])
	const { ContentContactsPage } = data

	return (
		<>
			<section className='container lg:pt-10 relative flex flex-row w-full pt-2 mb-4'>
				<div className='w-1/2 text-start'>
					<h1 className={cn(rubikGlitch.className, 'text-2xl font-bold')}>
						{ContentContactsPage.page.title}
					</h1>
					<ul className='my-2 pt-4 *:my-4'>
						{contactData.map(({ icon, text, link }, index) => (
							<li key={index} className='flex items-center justify-start gap-2'>
								<ContactsComponent icon={icon} text={text} link={link} />
							</li>
						))}
					</ul>
				</div>
				<div className='w-1/2'>
					<FeedBackForm currentUser={currentUser} />
				</div>
			</section>
			<section>
				<GoogleMap />
			</section>
		</>
	)
}
