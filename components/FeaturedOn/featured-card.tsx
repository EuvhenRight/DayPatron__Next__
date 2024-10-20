import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
interface Props {
	item: { image: string; url: string }
	variants: any
}

export const FeaturedCard = ({ item, variants }: Props) => {
	return (
		<motion.div
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			variants={variants}
		>
			<Link href={item.url} target='_blank' rel='noreferrer'>
				<div className='hover:border-slate-400 hover:transition hover:ease-in-out hover:delay-150'>
					<Image
						src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/partners/${item.image}`}
						width={250}
						height={100}
						alt={item.image}
						//TODO: add sizes images
					/>
				</div>
			</Link>
		</motion.div>
	)
}
