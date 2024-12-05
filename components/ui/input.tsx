'use client'
import * as React from 'react'

import { cn } from '@/lib/utils/utils'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		// Prevent focus on mouse click but still allow keyboard input
		const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
			// This prevents the default focus action when clicked
			e.preventDefault()

			// Explicitly focus the input programmatically only when clicked (but after preventing default)
			const inputElement = e.currentTarget
			setTimeout(() => {
				inputElement.focus() // Focus it after the mouse down to avoid default behavior
			}, 0)
		}
		return (
			<input
				type={type}
				className={cn(
					'flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300',
					className
				)}
				ref={ref}
				{...props}
				onMouseDown={handleMouseDown}
			/>
		)
	}
)
Input.displayName = 'Input'

export { Input }
