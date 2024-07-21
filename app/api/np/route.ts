import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const url = new URL(request.url)
	const city = url.searchParams.get('city')
	const divisionNumber = url.searchParams.get('divisionNumber')

	console.log(city, 'city')
	console.log(divisionNumber, 'divisionNumber')

	if (!city || !divisionNumber) {
		return NextResponse.json(
			{
				error:
					'Missing one or more search parameters: city, divisionNumber, address',
			},
			{ status: 400 }
		)
	}

	const apiKey =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJucCIsImlhdCI6MTcyMTM5NTY4OCwiZXhwIjoxNzIxMzk5Mjg4LCJzcmMiOiJhcGkyIiwicmVmIjoiMTlmZGQ1ZTAtZWQ4Yi0xMWU3LWJlY2YtMDA1MDU2ODgxYzZiIiwiY2lkIjoiIiwic3ViIjoiZXlKcGRpSTZJbEpLWlZKblFYZFhTRlJtU1dacWQyUjRMMjlpVFdjOVBTSXNJblpoYkhWbElqb2lTRFZ0YkRGbE5DOHJVbE51VmxSWllYQktjWGhpZWs4cmVIcE9UbVJ0VlVKbVdFSXhTRVZTUmtzMmNsVnVZVkZCUXpVMWQxcGFlalJQZWtzckwwRkpjQ0lzSW0xaFl5STZJalU0WXpVeU4ySTVOamd5TnpaallUUmhZbU5tWlRnNVl6QXhOR1V4WVRaalpERTVabU0xWlRVeE9USTFZemMyWVdJMk56SXpPR0V3WmpnMU5ETXdZMk1pTENKMFlXY2lPaUlpZlE9PSJ9.a-LjBgjXH0IZZ7jf9Zx1hXkSgg9HTd-3nwHxF-39kvw'

	const apiUrl = 'https://api.novaposhta.ua/v2.0/json/'

	const requestBody = {
		apiKey: apiKey,
		modelName: 'AddressGeneral',
		calledMethod: 'getWarehouses',
		methodProperties: {
			CityName: city,
			WarehouseId: divisionNumber,
		},
	}

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		)
	}
}
