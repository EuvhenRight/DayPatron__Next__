export default function Home() {
	return (
		<div>
			<video
				src={`${process.env.PUBLIC_VIDEO_URL}/video.mp4`}
				autoPlay
				loop
				muted
				playsInline
				className='top-0 left-0 h-full w-full object-cover'
			/>
		</div>
	)
}
