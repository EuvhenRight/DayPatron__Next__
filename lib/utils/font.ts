import {
	Geologica,
	Manrope,
	Mulish,
	Rubik_Dirt,
	Rubik_Glitch,
} from 'next/font/google'

export const rubikGlitch = Rubik_Glitch({
	weight: '400', // Rubik_Glitch only comes in regular (400)
	subsets: ['latin'],
	preload: false,
})

export const mulish = Mulish({
	weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	preload: false,
})

export const manrope = Manrope({
	weight: ['200', '300', '400', '500', '600', '700', '800'],
	subsets: ['latin'],
})

export const rubikDirt = Rubik_Dirt({
	weight: '400',
	subsets: ['latin'],
	preload: false,
})

export const geologica = Geologica({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	preload: false,
})
