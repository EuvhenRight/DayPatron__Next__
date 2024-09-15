import { AboutBlockContent } from '@/components/About/about-block-content'
import data from '@/lib/db/content.json'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Metadata } from 'next'

// METADATA GENERATOR
export const metadata: Metadata = {
	title: 'Хто ми?',
	description:
		'Наша місія полягає в тому, щоб зробити найкращі засоби для догляду за зброєю стандартом індустрії.',
	openGraph: {
		title: 'DayPatron',
		description:
			'Наша місія полягає в тому, щоб зробити найкращі засоби для догляду за зброєю стандартом індустрії.',
		url: `https://daypatron.com/about`,
		type: 'website',
		images: [
			{
				url: `${process.env.PUBLIC_IMAGE_URL}/DayLogo_ukraine.svg`,
				width: 800,
				height: 600,
				alt: 'Ukraine',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Хто ми?',
		description:
			'Наша місія полягає в тому, щоб зробити найкращі засоби для догляду за зброєю стандартом індустрії.',
		site: 'https://daypatron.com',
		creator: 'daypatronteam',
		images: `${process.env.PUBLIC_IMAGE_URL}/DayLogo_ukraine.svg`,
	},
}

function AboutPage() {
	// Define the years you want to display
	const years = ['2024', '2023', '2022']
	const { contentAboutPage } = data

	return (
		<section className='container lg:pt-5 relative flex flex-col'>
			<div className='my-10'>
				<h1 className={cn(rubikGlitch.className, 'text-4xl font-black mb-10')}>
					{contentAboutPage.aboutUs.title}
				</h1>
				<p>{contentAboutPage.aboutUs.description}</p>
				<p className='my-5'>{contentAboutPage.aboutUs.middleText}</p>
				<p>{contentAboutPage.aboutUs.endText}</p>
			</div>
			{years.map(year => {
				return (
					<AboutBlockContent
						key={year}
						data={data.contentAboutPage}
						year={Number(year)}
					/>
				)
			})}
		</section>
	)
}

export default AboutPage
