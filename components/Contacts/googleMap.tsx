import { GoogleMapsEmbed } from '@next/third-parties/google'
export const GoogleMapComponent = () => {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

	return (
		<div>
			<GoogleMapsEmbed
				apiKey={apiKey}
				zoom='16'
				width='100%'
				height='500px'
				mode='place'
				q='Daypatron, Ukraine'
			/>
		</div>
	)
}
