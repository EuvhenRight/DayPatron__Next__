// pages/api/register.js

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		return NextResponse.json({ message: 'Registration successful' })
	} catch (error) {
		console.error('Registration error:', error)
		return NextResponse.json({ error: 'Registration failed', message: error })
	}
}
