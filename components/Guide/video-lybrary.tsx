import { rubikDirt } from '@/lib/utils/font'
import { videoLibrary } from '@/lib/utils/partners-library'
import { cn } from '@/lib/utils/utils'
import { VideoCard } from '../Slider/video-card'

export const VideoLibrary = () => {
	return (
		<section className='container'>
			<h1 className={cn(rubikDirt.className, 'text-4xl text-center uppercase')}>
				Відео бібліотека
			</h1>
			<ul className='grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center'>
				{videoLibrary.map((item, index) => (
					<li key={index}>
						<VideoCard
							title={item.title}
							description={item.description}
							videoId={item.videoId}
						/>
					</li>
				))}
			</ul>
		</section>
	)
}
