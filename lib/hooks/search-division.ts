'use client'
import { useEffect, useState } from 'react'
import { Division } from '../types/types'

export function useSearchData(number: string | '') {
	const [data, setData] = useState<Division[]>()
	// LOADING STATE
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		const dataDivision = async () => {
			try {
				setLoading(true)
				// GET DATA FROM API DIFFERENT ENDPOINTS
				const response = await fetch(
					`http://localhost:3000/api/np/search?divisionNumber=${number}`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				)

				const divisions = await response.json()
				console.log(divisions, 'divisions')
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
