'use client'
import { BackButton } from '@/components/LoginForm/back-button'
import { Header } from '@/components/LoginForm/header'
import { PrivacyButton } from '@/components/LoginForm/privacy-button'
import { ShowSocial } from '@/components/LoginForm/show-social'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import React from 'react'

interface Props {
	children: React.ReactNode
	headerLabel: string
	buttonBackHref: string
	buttonBackLabel?: string
	buttonPrivacyHref: string
	buttonPrivacyLabel: string
	showSocial?: boolean
}
export const CardWrapper = ({
	children,
	headerLabel,
	buttonBackHref,
	buttonBackLabel,
	buttonPrivacyHref,
	buttonPrivacyLabel,
	showSocial,
}: Props) => {
	return (
		<Card className=' w-[500px] shadow-xl'>
			<CardHeader className='flex flex-col justify-center text-center items-center'>
				<Header label={headerLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocial && (
				<CardFooter className='w-full justify-center'>
					<ShowSocial />
				</CardFooter>
			)}
			{buttonBackLabel && (
				<CardFooter>
					<BackButton label={buttonBackLabel} href={buttonBackHref} />
				</CardFooter>
			)}
			<CardFooter className='justify-center'>
				<PrivacyButton label={buttonPrivacyLabel} href={buttonPrivacyHref} />
			</CardFooter>
		</Card>
	)
}
