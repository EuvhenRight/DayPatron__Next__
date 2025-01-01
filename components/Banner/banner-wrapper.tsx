'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import Image from 'next/image'
import React from 'react'
import { BackButton } from './back-button'
import { Header } from './header'

interface Props {
	children: React.ReactNode
	headerLabel: string
	buttonBackHref: string
	buttonBackLabel?: string
}
export const BannerWrapper = ({
	children,
	headerLabel,
	buttonBackHref,
	buttonBackLabel,
}: Props) => {
	return (
		<Card className='w-[700px] h-auto shadow-xl bg-[url("/images/All_Cleaners.jpg")] bg-center bg-cover relative'>
			<Image
				className='-rotate-90 absolute left-0'
				src='/images/DayLogo.svg'
				alt='All_Cleaners'
				width={200}
				height={200}
			/>
			<CardHeader className='flex flex-col justify-center text-center items-center'>
				<Header label={headerLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{buttonBackLabel && (
				<CardFooter>
					<BackButton label={buttonBackLabel} href={buttonBackHref} />
				</CardFooter>
			)}
			<CardFooter className='w-full'></CardFooter>
		</Card>
	)
}
