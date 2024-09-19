import { YouTubeEmbed } from '@next/third-parties/google'

export const YouTube = () => {
	return (
		<>
			<YouTubeEmbed
				videoid='V6KhwcCIMd8'
				height={400}
				params='controls=1'
				playlabel='Play'
				style='border-radius: 20px; border: 1px solid #ccc;'
			/>
			<YouTubeEmbed
				videoid='W9jip0sceN8'
				height={400}
				params='controls=1'
				playlabel='Play'
				style='border-radius: 20px; border: 1px solid #ccc;'
			/>
		</>
	)
}
