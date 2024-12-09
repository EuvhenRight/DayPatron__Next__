import Link from 'next/link'

interface Props {
	label: string
}
export const RulesRPolicyInfo = ({ label }: Props) => {
	const rules = (
		<Link
			className='px-3 font-bold underline hover:no-underline text-neutral-500'
			href='/rules-reviews'
		>
			Правила публікації відгуків
		</Link>
	)

	return (
		<div>
			<p className='text-[12px] text-neutral-500 py-1'>
				{`Натискаючи на кнопку ${label}, я погоджуюсь з`}
				{rules}
				{`"DAYPATRON.COM.UA"`}
			</p>
		</div>
	)
}
