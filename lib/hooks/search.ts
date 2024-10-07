'use client'
import { useEffect, useState } from 'react'
import { Division, ProductWithVariantsWithReviews } from '../types/types'

export function useSearchDataDivision(number: string | '') {
	const [data, setData] = useState<Division[]>()
	// LOADING STATE
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const dataDivision = async () => {
			try {
				setLoading(true)
				// GET DATA FROM API DIFFERENT ENDPOINTS
				const response = await fetch(
					`${process.env.NEXTAUTH_URL}/api/np/search?divisionNumber=${number}`,
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
	}, [number])

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
					`${process.env.NEXTAUTH_URL}/api/search/query?searchQuery=${searchWords}`,
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
