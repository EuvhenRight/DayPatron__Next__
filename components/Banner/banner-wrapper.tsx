'use client'
import { addCookieToBannerOut } from '@/actions/subscription'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BackButton } from './back-button'
import { Header } from './header'

interface Props {
	children: React.ReactNode
	headerLabel: string
	buttonBackLabel?: string
	isSuccess?: boolean
	setShowBanner: React.Dispatch<React.SetStateAction<boolean>>
	setGift: React.Dispatch<React.SetStateAction<boolean>>
}
export const BannerWrapper = ({
	children,
	headerLabel,
	buttonBackLabel,
	isSuccess,
	setShowBanner,
	setGift,
}: Props) => {
	const handleClose = () => {
		setShowBanner(false)
		setGift(true)
		addCookieToBannerOut()
	}

	const closeInformation = () => {
		setShowBanner(false)
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0 }}
			className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'
		>
			<Card className='w-full h-auto md:w-[800px] md:h-[560px] shadow-xl bg-[url("/images/All_Cleaners.jpg")] bg-center bg-cover relative flex flex-row border-none'>
				<CardHeader className='flex-col items-end justify-between p-10 hidden md:flex'>
					<p className='italic text-white text-md'>
						Нехай старт буде приємним...
					</p>
					<Image
						src='/images/DayLogo.svg'
						alt='All_Cleaners'
						width={400}
						height={200}
					/>
				</CardHeader>
				{isSuccess ? (
					<CardContent className='flex flex-col justify-between items-center gap-2 w-full md:w-2/3 p-10 bg-zinc-800 rounded-lg'>
						<div
							className='text-gray-300 hover:text-white absolute top-4 right-4 cursor-pointer'
							onClick={closeInformation}
						>
							<AiOutlineClose className='w-6 h-6' />
						</div>
						<h1 className='text-white text-center font-bold text-3xl'>
							Вітаємо!
						</h1>
						<h3 className='text-white text-center font-light'>
							Тепер ви будете отримувати спеціальні пропозиції та оновлення від
							нас! Використовуйте промокод `СТАРТ-20` під час оформлення
							замовлення та отримайте знижку 20%.
						</h3>
						<p className='text-gray-400 text-sm font-light mt-5'>
							Цей промокод можна використати лише один раз! Вводьте його під час
							оформлення замовлення точно так, як зазначено.
						</p>
					</CardContent>
				) : (
					<CardContent className='flex flex-col justify-between items-center gap-2 w-full md:w-2/3 p-10 bg-zinc-800 rounded-lg'>
						<Header label={headerLabel} />
						{children}
						{buttonBackLabel && (
							<BackButton handleClose={handleClose} label={buttonBackLabel} />
						)}
					</CardContent>
				)}
			</Card>
		</motion.div>
	)
}
