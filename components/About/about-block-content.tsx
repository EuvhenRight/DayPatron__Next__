import { ContentData } from '@/lib/types/contentTypes'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Move3D } from 'lucide-react'
import Image from 'next/image'

interface Props {
	data: ContentData
	year: number
}
export const AboutBlockContent = ({ data, year }: Props) => {
	return (
		<>
			{/* 2024 */}
			<div className='w-full flex flex-row justify-between items-center my-7'>
				<div className='w-2 h-12 mr-4 bg-red-500'></div>
				<h1 className={cn(rubikGlitch.className, 'text-3xl font-black')}>
					{year}
				</h1>
				<div className='bg-gray-400 max-w-full w-full ml-4 h-[1px]'></div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center '>
				{year === 2024 && (
					<>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md italic'>
							{data[2024].AboutFirstBlock.text}
						</div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md'>
							{data[2024].AboutSecondBlock.textSecond}
						</div>
						<div className='flex flex-col items-center justify-around relative'>
							<Image
								src={data[2024].AboutImageBlock.image}
								alt='2024'
								width={250}
								height={250}
								className='rounded-full m-5'
							/>
							<p className='absolute left-0 bottom-0'>
								<Move3D size={100} />
							</p>
						</div>
					</>
				)}
				{/* 2023 */}
				{year === 2023 && (
					<>
						<div className='flex flex-col items-center justify-around'>
							<Image
								src={data[2023].AboutImageBlock.image}
								alt='2023'
								width={200}
								height={200}
							/>
							<h2 className='text-xl font-extrabold text-center'>
								{data[2023].AboutImageBlock.titleH1?.toUpperCase()}
							</h2>
							<p className='text-center font-bold'>
								{data[2023].AboutImageBlock.title}
							</p>
						</div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md italic'>
							{data[2023].AboutFirstBlock.text}
						</div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md'>
							{data[2023].AboutSecondBlock.textSecond}
						</div>
					</>
				)}
				{/* 2022 */}
				{year === 2022 && (
					<>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md italic'>
							{data[2022].AboutFirstBlock.text}
						</div>
						<div className='flex flex-col items-center justify-around'>
							<h2 className='text-3xl font-black text-center my-3'>
								{data[2022].AboutImageBlock.titleH1?.toUpperCase()}
							</h2>
							<Image
								src={data[2022].AboutImageBlock.image}
								alt='2022'
								width={400}
								height={200}
							/>
						</div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md'>
							{data[2022].AboutSecondBlock.textSecond}
						</div>
					</>
				)}
			</div>
		</>
	)
}
