import { FeaturedOn } from '@/components/FeaturedOn/featured-on'

export default function Home() {
	return (
		<section>
			<div>
				<video
					src={`${process.env.PUBLIC_VIDEO_URL}/video2.mp4`}
					autoPlay
					loop
					muted
					playsInline
					className='top-0 left-0 h-full w-full'
				/>
			</div>
			<div>
				<FeaturedOn />
			</div>
		</section>
	)
}
