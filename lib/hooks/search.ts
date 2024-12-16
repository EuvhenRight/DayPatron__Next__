'use client'
import { useEffect, useState } from 'react'
import {
	CityName,
	Division,
	ProductWithVariantsWithReviews,
} from '../types/types'

export function useSearchDataDivision(number: string | '', city: string | '') {
	const [data, setData] = useState<Division[]>()
	// LOADING STATE
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const dataDivision = async () => {
			try {
				setLoading(true)
				// GET DATA FROM API DIFFERENT ENDPOINTS
				const response = await fetch(
					`/api/np/search?divisionNumber=${number}&cityNameRef=${city}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				)
				const divisions = await response.json()
				return setData(divisions?.data) // SET DATA WITH .data
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		dataDivision()
	}, [number, city])

	return { data, loading }
}

export function useSearchMainData(searchWords: string | null) {
	const [data, setData] = useState<ProductWithVariantsWithReviews[]>()
	// LOADING STATE
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const mainData = async () => {
			if (!searchWords) return

			try {
				setLoading(true)
				// GET DATA FROM API DIFFERENT ENDPOINTS
				const response = await fetch(
					`/api/search/query?searchQuery=${searchWords}`,
					{ next: { revalidate: 30 } }
				)
				const searchResult = await response.json()

				return setData(searchResult) // SET DATA WITH .data
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		mainData()
	}, [searchWords])

	return { data, loading }
}

export function useSearchCityData(city: string | '') {
	const [cityName, setCityName] = useState<CityName[] | null>(null)
	// LOADING STATE
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const dataCityName = async () => {
			try {
				setLoading(true)
				// GET DATA FROM API DIFFERENT ENDPOINTS
				const response = await fetch(`/api/np/search?cityName=${city}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				const dataCity = await response.json()
				return setCityName(dataCity.data) // SET DATA WITH .data
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		dataCityName()
	}, [city])

	return { cityName, loading }
}
