import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const jwtToken =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJucCIsImlhdCI6MTcxODM2MjE3NSwiZXhwIjoxNzE4MzY1Nzc1LCJzcmMiOiJhcGkyIiwicmVmIjoiMTlmZGQ1ZTAtZWQ4Yi0xMWU3LWJlY2YtMDA1MDU2ODgxYzZiIiwiY2lkIjoiIiwic3ViIjoiZXlKcGRpSTZJblZEU2tseFNrNDVUalZwZW5sYVduWm1NV05EUzNjOVBTSXNJblpoYkhWbElqb2lSR3h4TVdkTmFWQktha0l5VWl0cU1uaFFVbmhvWlRKSmIzbE9aRU5NTDNKSU5rbDBPUzl6VDJaMFdWQnViVGx1Wm1OSVZXWkNURVJoUlVaalRVNTBTQ0lzSW0xaFl5STZJamhpWTJOaU1XRmlOR1V6TURrNE5ESmpaV1UzWkROa01HSXdNamcxTVRFeE16ZGlOV0UyTWpBMk1EWm1aV00yTnpZMll6WXhNV1JrWmpSaU9HWTJaVEVpTENKMFlXY2lPaUlpZlE9PSJ9.nVpqdVSJSNZfMrphcRmd9SN4zyWrxDeQyTujTOSpSY4'

	const url = 'https://api.novapost.com/v.1.0/divisions?limit=1&page=1'

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${jwtToken}`,
			},
		})

		if (!response.ok) {
			throw new Error(response.statusText)
		}

		const data = await response.json()
		NextResponse.json(data)
	} catch (error) {
		// Handle errors and return an appropriate response
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		)
	}
}
