import { MoveHorizontal, MoveVertical } from 'lucide-react'
import Image from 'next/image'
export const AboutOfProduct = () => {
	return (
		<>
			<div className='flex gap-4'>
				<Image
					src='/images/CLP-500ml.png'
					width={200}
					height={200}
					alt='guide'
				/>
				<div className='text-2xl rounded-lg bg-zinc-100 w-40 h-40 p-4'>
					<Image
						src='/images/clp_tr.svg'
						alt='guide'
						width={200}
						height={200}
					/>
				</div>
				<div className='flex gap-4 *:bg-neutral-100 items-center'>
					<Image
						src='/images/container-100ml.png'
						alt='guide'
						width={200}
						height={200}
					/>
					<Image
						src='/images/container-250ml.png'
						alt='guide'
						width={200}
						height={200}
					/>
					<div>
						<Image
							src='/images/container-500ml.png'
							alt='guide'
							width={100}
							height={100}
						/>
						<div className='flex items-center justify-center my-4'>
							<MoveHorizontal size={24} strokeWidth={0.5} />
							<MoveVertical size={24} strokeWidth={0.5} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
