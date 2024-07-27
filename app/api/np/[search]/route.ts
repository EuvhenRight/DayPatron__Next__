import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const url = new URL(request.url)
	const city = url.searchParams.get('city')
	const divisionNumber = url.searchParams.get('divisionNumber')

	const apiKey = process.env.NOVA_POSHTA_TOKEN

	const apiUrl = process.env.NOVA_POSHTA_URL

	const divisionNumberBody = {
		apiKey: apiKey,
		modelName: 'AddressGeneral',
		calledMethod: 'getWarehouses',
		methodProperties: {
			WarehouseId: divisionNumber,
			Limit: '10',
			system: 'DevCentre',
		},
	}

	try {
		const response = await fetch(apiUrl!, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(divisionNumberBody),
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
