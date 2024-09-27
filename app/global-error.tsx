'use client'

export default function Error({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	return (
		<div>
			<h1>Щось пішло не так</h1>
			<pre>{error.message}</pre>
			<button
				onClick={
					// ATTENTION: do not use async function here
					() => reset()
				}
			>
				Retry
			</button>
		</div>
	)
}
