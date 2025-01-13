'use client'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BannerForm } from './banner-form'
import { GiftPresents } from './gift'

export const SaleComponent = () => {
	const [gift, setGift] = useState<boolean>(false)
	const [showBanner, setShowBanner] = useState(false)
	const bannerOut = document.cookie.includes('bannerOut')
	useEffect(() => {
		const bannerSeen = document.cookie.includes('bannerSeen')

		if (bannerOut) {
			setGift(true)
		}

		if (!bannerSeen && !bannerOut) {
			const timer = setTimeout(() => {
				setShowBanner(true)
			}, 20000) // Show after 20 seconds
			console.log('show banner')
			return () => clearTimeout(timer)
		}
	}, [bannerOut])
	return (
		<AnimatePresence mode='wait'>
			{showBanner && (
				<BannerForm
					key='bannerForm'
					setGift={setGift}
					setShowBanner={setShowBanner}
				/>
			)}
			{gift && bannerOut && (
				<GiftPresents
					key='giftPresents'
					setGift={setGift}
					setShowBanner={setShowBanner}
				/>
			)}
		</AnimatePresence>
	)
}