import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const url = new URL(request.url)

	const divisionNumber = url.searchParams.get('divisionNumber')
	const cityName = url.searchParams.get('cityName')
	const cityNameDescription = url.searchParams.get('cityNameRef')

	const apiKey = process.env.NOVA_POSHTA_TOKEN

	const apiUrl = process.env.NOVA_POSHTA_URL

	const cityNameBody = {
		apiKey: apiKey,
		modelName: 'AddressGeneral',
		calledMethod: 'getSettlements',
		methodProperties: {
			FindByString: cityName || null,
			Limit: '20',
			Warehouse: '1',
		},
	}

	const divisionNumberBody = {
		apiKey: apiKey,
		modelName: 'AddressGeneral',
		calledMethod: 'getWarehouses',
		methodProperties: {
			CityName: cityNameDescription,
			FindByString: divisionNumber || null,
			Limit: '500',
			Page: '1',
		},
	}

	try {
		const response = await fetch(apiUrl!, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(
				divisionNumberBody.methodProperties.CityName !== null
					? divisionNumberBody
					: cityNameBody
			),
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
