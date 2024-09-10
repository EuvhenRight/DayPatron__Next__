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
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Retry
			</button>
		</div>
	)
}
