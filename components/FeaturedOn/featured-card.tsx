import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
interface Props {
	item: { image: string; url: string }
}

export const FeaturedCard = ({ item }: Props) => {
	return (
		<motion.div whileHover={{ scale: 1.1 }}>
			<Link href={item.url} target='_blank' rel='noreferrer'>
				<div className='hover:border-slate-400 hover:transition hover:ease-in-out hover:delay-150'>
					<Image
						src={`${process.env.PUBLIC_IMAGE_URL}/partners/${item.image}`}
						width={250}
						height={100}
						alt={item.image}
					/>
				</div>
			</Link>
		</motion.div>
	)
}
