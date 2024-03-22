'use client'
import React from 'react'
import { BackButton } from './back-button'
import { Header } from './header'
import { PrivacyButton } from './privacy-button'
import { ShowSocial } from './show-social'
interface CardWrapperProps {
	children: React.ReactNode
	headerLabel: string
	buttonBackHref: string
	buttonBackLabel?: string
	buttonPrivacyHref: string
	buttonPrivacyLabel: string
	showSocial?: boolean
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
	children,
	headerLabel,
	buttonBackHref,
	buttonBackLabel,
	buttonPrivacyHref,
	buttonPrivacyLabel,
	showSocial,
}) => {
	return (
		<div className='card w-[500px] shadow-xl my-6'>
			<div className='card-body justify-center'>
				<div className='card-title flex-col'>
					<Header label={headerLabel} />
				</div>
				<div>{children}</div>
				<div className='card-actions justify-center'>
					{showSocial && (
						<div className='card-actions w-full justify-center'>
							<ShowSocial />
						</div>
					)}
					{buttonBackLabel && (
						<BackButton label={buttonBackLabel} href={buttonBackHref} />
					)}
					<PrivacyButton label={buttonPrivacyLabel} href={buttonPrivacyHref} />
				</div>
			</div>
		</div>
	)
}
