import { FeaturedOn } from '@/components/FeaturedOn/featured-on'
import { MissionInfo } from '@/components/Mission-Info/mission'

export default function Home() {
	return (
		<>
			<div>
				<video
					src={`${process.env.PUBLIC_VIDEO_URL}/video2.mp4`} // PUBLIC URL NEXT FETCHERS
					autoPlay
					loop
					muted
					playsInline
					className='top-0 left-0 h-full w-full aspect-video object-cover'
				/>
			</div>
			<section className='container'>
				<div>
					<MissionInfo />
				</div>
				<div>
					<FeaturedOn />
				</div>
			</section>
		</>
	)
}
