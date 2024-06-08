// components/CartItem.tsx
'use client'
import { deleteItem, editItem } from '@/actions/cart'
import { PriceTag } from '@/components/PriceTag'
import { CartItemWithVariants } from '@/lib/types/types'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { toast } from 'sonner'

interface Props {
	item: CartItemWithVariants
}

export const CartItemComponent = ({
	item: { variant: product, quantity },
}: Props) => {
	const [pending, startTransition] = useTransition()
	const path = usePathname()

	// DELETE CART ITEM
	const deleteCartItem = (itemId: string) => {
		if (!itemId) {
			toast.error('something went wrong')
		}
		startTransition(() => {
			deleteItem(itemId)
		})
	}

	// UPDATE QUANTITY OF CART ITEM
	const updateQuantity = (itemId: string, quantity: number) => {
		if (!itemId) {
			toast.error('something went wrong')
		}
		startTransition(() => {
			editItem(itemId, quantity)
		})
	}

	return (
		<div
			className={`flex flex-row ${
				path === '/checkouts' ? 'text-black' : 'text-white'
			} py-2 w-full justify-between border-b-2 border-black`}
		>
			{/* CLICK TO PRODUCT DETAILS */}
			<Link href={`/products/${product.productId}/details`}>
				<Image
					onClick={() => {}}
					className='w-20'
					width={100}
					height={100}
					src={`/images/${product.image}`}
					alt={product.image}
				/>
			</Link>
			<div className='w-full flex flex-col justify-between ml-4'>
				<div className='flex justify-between items-center'>
					<h2 className='text-md'>{product.name}</h2>
					{/* REMOVE ONE CART ITEM FROM CART */}
					<button
						onClick={() => {
							deleteCartItem(product.id)
						}}
						disabled={pending}
					>
						<AiOutlineClose
							className='hover:translate-x-0 opacity-60 hover:opacity-100 transition cursor-pointer'
							style={{ color: 'white', width: 20, height: 20 }}
						/>
					</button>
				</div>
				{/* SIZE */}
				<div className='flex gap-2'>
					<h4>Об&apos;єм:</h4>
					<h4>{product.volume}</h4>
				</div>
				<div className='flex justify-between'>
					<div
						className={`flex border ${
							path === '/checkouts' ? 'border-black' : 'border-white'
						} text-md`}
					>
						{/* QUANTITY */}
						<button
							disabled={pending}
							onClick={() => {
								updateQuantity(product.id, quantity - 1)
							}}
							className='hover:bg-white hover:text-zinc-100 px-2'
						>
							{/* MINUS ICON */}
							<Image
								className='w-3'
								width={20}
								height={20}
								src='/icons/minus-sign.svg'
								alt='minus_icon'
							/>
						</button>
						<h4 className='p-1'>{quantity}</h4>
						<button
							disabled={pending}
							onClick={() => {
								updateQuantity(product.id, quantity + 1)
							}}
							className='hover:bg-white hover:text-zinc-100 px-2'
						>
							{/* PLUS ICON */}
							<Image
								className='w-3 fill-white hover:fill-black'
								width={20}
								height={20}
								src='/icons/add-plus.svg'
								alt='plus_icon'
							/>
						</button>
					</div>
					{/* PRICE */}
					{/* DISCOUNT ON/OFF */}
					{product.discount_price! > 0 ? (
						<p className='text-green-500 font-bold'>
							{<PriceTag price={product.discount_price!} />}
						</p>
					) : (
						<h4>{<PriceTag price={product.original_price} />}</h4>
					)}
				</div>
			</div>
		</div>
	)
}
