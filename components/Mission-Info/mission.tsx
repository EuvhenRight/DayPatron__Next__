'use client'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { TriangleAnimation } from '../Animation/triangle'

export const MissionInfo = () => {
	return (
		<div className='w-full flex flex-col items-center justify-center my-10'>
			<div className='w-full relative'>
				{/* MISSION */}
				<h1
					className={cn(
						rubikGlitch.className,
						'text-3xl md:text-5xl px-4 text-start text-neutral-800 flex items-center justify-start mb-10 ml-2 md:ml-20'
					)}
				>
					<span className='text-red-600'>[ </span>
					<span className='mx-2 text-neutral-800'>Наша місія</span>
					<span className='text-red-600'>] </span>
				</h1>
				<p className='text-lg md:text-xl italic text-end mt-10 mb-14'>
					&ldquo;Зробіть свою зброю непереможною: ми захищаємо її, щоб ви могли
					захищати себе!&rdquo;
				</p>
				{/* TRIANGLE Animation */}
				<TriangleAnimation />
			</div>
		</div>
	)
}
