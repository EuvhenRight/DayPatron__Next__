import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const jwtToken =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJucCIsImlhdCI6MTcyMTEzOTEyNCwiZXhwIjoxNzIxMTQyNzI0LCJzcmMiOiJhcGkyIiwicmVmIjoiMTlmZGQ1ZTAtZWQ4Yi0xMWU3LWJlY2YtMDA1MDU2ODgxYzZiIiwiY2lkIjoiIiwic3ViIjoiZXlKcGRpSTZJbFI2YTFSclZqZFhjWE5OY3podldrSkhSMWhFVUhjOVBTSXNJblpoYkhWbElqb2lWSEphWmpCVmRtUkJMMDFDWjB0bGFrZDFTRkZUU3k5dVlXNU5ORTlJWlc1RVVtaHlSa3BEWkRSYVRYTlVSalJQU0hwb1ZtVk1Temg0TlhscFdHeHhSaUlzSW0xaFl5STZJbUU1WWpoa1pUVTBaVGRqTmpkalpUVmxPRFJqTWpaaE1tTTFaamt3WkRKbVpETmpPREExTm1OaFlqa3lZMlJqWVRFME16aGxNalF5WVdaaFlXSTRPR1FpTENKMFlXY2lPaUlpZlE9PSJ9.nteh2NUqL4xadX4AM91UmcpJ6GmOmFaQeGWu0784DWI'

	const url =
		'https://api.novapost.com/v.1.0/divisions?countryCodes%5B%5D=UA&limit=10&page=1'

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: jwtToken,
			},
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		// Handle errors and return an appropriate response
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		)
	}
}
