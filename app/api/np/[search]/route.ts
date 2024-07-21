import { ValidationSchema } from '@/lib/db/validation'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	const url = new URL(request.url)
	const city = url.searchParams.get('city')
	const divisionNumber = url.searchParams.get('divisionNumber')

	const requestData = await request.json()

	const combinedData = {
		city,
		divisionNumber,
		...requestData,
	}

	const validatedBody = ValidationSchema.loginUser.safeParse(combinedData)

	if (!validatedBody.success) {
		return NextResponse.json(validatedBody.error.errors, { status: 400 })
	}

	const apiKey = process.env.NOVA_POSHTA_TOKEN
	console.log(apiKey)
	const apiUrl = process.env.NOVA_POSHTA_URL
	console.log(apiUrl)
	const requestBody = {
		apiKey: apiKey,
		modelName: 'AddressGeneral',
		calledMethod: 'getWarehouses',
		methodProperties: {
			CityName: city,
			WarehouseId: divisionNumber,
			Limit: '10',
			Page: '1',
			system: 'DevCentre',
		},
	}

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
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
