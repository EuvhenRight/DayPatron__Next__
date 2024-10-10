'use server'
import prisma from '@/lib/prisma'
import { BonusCode } from '@prisma/client'

interface Props {
	code: string
	discountValue: number
}

export async function createBonusCode({
	code,
	discountValue,
}: Props): Promise<BonusCode | { success: false; message: string }> {
	try {
		const bonusCode = await prisma.bonusCode.create({
			data: {
				code,
				discountValue: discountValue,
			},
		})

		return bonusCode // Return the created bonus code
	} catch (error) {
		console.error('Error creating bonus code:', error)
		return { success: false, message: 'Не вдалося створити промокод.' } // User-friendly error message
	}
}
