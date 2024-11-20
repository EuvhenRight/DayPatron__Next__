import { ClipboardCheck, ShareIcon } from 'lucide-react'
import React, { useState } from 'react'

export const ShareButton: React.FC = () => {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (typeof window !== 'undefined') {
			try {
				await navigator.clipboard.writeText(window.location.href)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
			} catch (err) {
				console.error('Failed to copy!', err)
			}
		}
	}

	return (
		<div className='relative'>
			<button
				onClick={handleCopy}
				className='p-2 text-black hover:border-red-600 hover:text-red-600 hover:-translate-y-1 transition-all'
			>
				{copied ? (
					<ClipboardCheck className='h-5 w-5' />
				) : (
					<ShareIcon className='h-5 w-5' />
				)}
			</button>
			{copied && (
				<div className='absolute top-0 left-0 mt-8 p-2 bg-green-500 text-white rounded shadow text-sm'>
					Посилання скопійовано!
				</div>
			)}
		</div>
	)
}
