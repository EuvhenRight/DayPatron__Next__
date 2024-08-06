'use client'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

export const GoogleMap = () => {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
	return (
		<APIProvider apiKey={apiKey}>
			<Map
				style={{ width: '100vw', height: '500px' }}
				defaultCenter={{ lat: 50.42015, lng: 30.5201551 }}
				defaultZoom={12}
				gestureHandling={'greedy'}
				disableDefaultUI={true}
			>
				<Marker position={{ lat: 50.42015, lng: 30.5201551 }} />
			</Map>
		</APIProvider>
	)
}
