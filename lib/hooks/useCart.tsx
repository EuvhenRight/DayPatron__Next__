import type { ProductInCart } from '@/lib/types/types'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

type CartContextType = {
	cartTotalQuantity: number
	cartTotalSumDiscount: number
	cartTotalAmount: number
	showToast: boolean
	cartItems: ProductInCart[] | null
	handleAddToCart: (product: ProductInCart) => void
	handleRemoveFromCart: (product: ProductInCart) => void
	handleIncrementQuantity: (product: ProductInCart) => void
	handleDecrementQuantity: (product: ProductInCart) => void
	handleClearCart: () => void
}

export const CartContext = createContext<CartContextType | null>(null)

interface Props {
	[propsName: string]: any
}
export const CartContextProvider = (props: Props) => {
	const [cartTotalQuantity, setCartTotalQuantity] = useState(0)
	const [cartTotalSumDiscount, setCartTotalSumDiscount] = useState(0)
	const [cartTotalAmount, setCartTotalAmount] = useState(0)
	const [cartItems, setCartItems] = useState<ProductInCart[] | null>(null)
	const [showToast, setShowToast] = useState<boolean>(false)

	// GET CART
	useEffect(() => {
		const localCard: any = localStorage.getItem('ProductDayPatron')
		const cart = JSON.parse(localCard)
		setCartItems(cart)
	}, [])

	// CALCULATE TOTAL
	useEffect(() => {
		if (cartItems) {
			const { qty, amount, sumDiscount } = cartItems?.reduce(
				(acc, item) => {
					const price =
						item.discount_price !== 0
							? item.discount_price
							: item.original_price

					const sumDiscount = item.quantity * (item.original_price! - price!)

					const itemTotalOriginal = item.quantity * price!

					acc.qty += item.quantity
					acc.sumDiscount += sumDiscount
					acc.amount += itemTotalOriginal
					return acc
				},
				{
					qty: 0,
					sumDiscount: 0,
					amount: 0,
				}
			)
			setCartTotalSumDiscount(sumDiscount)
			setCartTotalQuantity(qty)
			setCartTotalAmount(amount)
		}
	}, [cartItems])
	// ADD TO CART
	const handleAddToCart = useCallback((product: ProductInCart) => {
		let clear: NodeJS.Timeout // Define clear variable in the outer scope
		setCartItems(prev => {
			let updateCartItems
			if (prev) {
				updateCartItems = [...prev, product]
			} else {
				updateCartItems = [product]
			}
			setShowToast(true) // Show the toast when a new item is added to the cart
			clear = setTimeout(() => {
				setShowToast(false) // Hide the toast after 3 seconds
			}, 3000)

			localStorage.setItem('ProductDayPatron', JSON.stringify(updateCartItems))
			return updateCartItems
		})
		return () => clearTimeout(clear)
	}, [])

	// CLEAR CART
	const handleClearCart = useCallback(() => {
		setCartItems([])
		setCartTotalQuantity(0)
		localStorage.removeItem('ProductDayPatron')
	}, [cartItems])
	// REMOVE FROM CART
	const handleRemoveFromCart = useCallback(
		(product: ProductInCart) => {
			if (cartItems) {
				const filteredCartItems = cartItems.filter(
					(item: ProductInCart) => item.article !== product.article
				)
				setCartItems(filteredCartItems)
				localStorage.setItem(
					'ProductDayPatron',
					JSON.stringify(filteredCartItems)
				)
			}
		},
		[cartItems]
	)
	// INCREMENT QUANTITY
	const handleIncrementQuantity = useCallback(
		(product: ProductInCart) => {
			let updateCartItems
			if (product.quantity === 99) {
				return new Error('Maximum quantity reached')
			}

			if (cartItems) {
				updateCartItems = [...cartItems]

				const findIndex = cartItems.findIndex(
					(item: ProductInCart) => item.article === product.article
				)

				if (findIndex > -1) {
					updateCartItems[findIndex].quantity = ++updateCartItems[findIndex]
						.quantity
					setCartItems(updateCartItems)
					localStorage.setItem(
						'ProductDayPatron',
						JSON.stringify(updateCartItems)
					)
				}
			}
		},
		[cartItems]
	)
	// DECREMENT QUANTITY
	const handleDecrementQuantity = useCallback(
		(product: ProductInCart) => {
			let updateCartItems
			if (product.quantity === 1) {
				return new Error('Minimum quantity reached')
			}

			if (cartItems) {
				updateCartItems = [...cartItems]

				const findIndex = cartItems.findIndex(
					(item: ProductInCart) => item.article === product.article
				)

				if (findIndex > -1) {
					updateCartItems[findIndex].quantity = --updateCartItems[findIndex]
						.quantity
					setCartItems(updateCartItems)
					localStorage.setItem(
						'ProductDayPatron',
						JSON.stringify(updateCartItems)
					)
				}
			}
		},
		[cartItems]
	)

	const value = {
		cartTotalQuantity,
		cartTotalSumDiscount,
		cartTotalAmount,
		cartItems,
		handleAddToCart,
		showToast,
		handleRemoveFromCart,
		handleIncrementQuantity,
		handleDecrementQuantity,
		handleClearCart,
	}

	return <CartContext.Provider value={value} {...props} />
}

export const useCart = () => {
	const context = useContext(CartContext)

	if (!context) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}
