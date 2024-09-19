'use server'
import prisma from '@/lib/db/client'
import { BonusCode } from '@prisma/client'

interface Props {
	code: string
	discountValue: number
}
export async function createBonusCode({
	code,
	discountValue,
}: Props): Promise<BonusCode> {
	const bonusCode = await prisma.bonusCode.create({
		data: {
			code,
			discountValue: discountValue,
		},
	})

	return bonusCode
}
