'use client'
import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useMemo, useRef } from 'react'
export const GoogleMapComponent = () => {
	// GOOGLE MAPS CENTER
	const center = useMemo(
		() => ({
			lat: 50.42015,
			lng: 30.5201551,
		}),
		[]
	)
	// GOOGLE MAPS API KEY
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
	const mapRef = useRef<google.maps.Map | null>(null)

	useEffect(() => {
		const loadMap = async () => {
			try {
				// INITIALIZE GOOGLE MAPS LOADER
				const loader = new Loader({
					apiKey: apiKey,
					version: 'weekly', // SPECIFY API VERSION
					libraries: ['marker'], // SPECIFY REQUIRED LIBRARIES§
				})

				// IMPORT GOOGLE MAPS LIBRARIES
				const google = (await loader.importLibrary(
					'maps'
				)) as google.maps.MapsLibrary
				const { AdvancedMarkerElement } = (await loader.importLibrary(
					'marker'
				)) as google.maps.MarkerLibrary

				// LOAD GOOGLE MAPS
				const map = new google.Map(document.getElementById('map')!, {
					center: center,
					zoom: 16,
					mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
					mapTypeId: 'terrain',
				})
				mapRef.current = map

				const MarkerImg = document.createElement('img')
				// PICTURE
				MarkerImg.src = `${process.env.PUBLIC_IMAGE_URL}/favicon.svg`
				MarkerImg.style.width = '64px'

				new AdvancedMarkerElement({
					map: map,
					position: center,
					title: 'Daypatron',
					content: MarkerImg,
				})
			} catch (error) {
				console.error('Error loading Google Maps:', error)
			}
		}

		loadMap()
	}, [apiKey, center])

	// RENDER SIZE GOOGLE MAP
	const containerStyle = {
		width: '100%',
		height: '500px',
	}

	return <div id='map' style={containerStyle}></div>
}
