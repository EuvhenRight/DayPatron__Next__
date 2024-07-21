'use client'
import { useEffect, useState } from 'react'

export function useSearchData(searchData: string) {
	const [data, setData] = useState()
	// LOADING STATE
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const dataDivision = async () => {
			try {
				setLoading(true)
				// GET DATA FROM API DIFFERENT ENDPOINTS
				const response = searchData
					? await fetch(`api/np/${searchData}`)
					: await fetch('api/np/')

				const posts = await response.json()
				return setData(posts?.data) // SET DATA WITH .data
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		dataDivision()
	}, [searchData])

	return { data, loading }
}
