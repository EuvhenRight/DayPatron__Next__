import Link from 'next/link'

interface Props {
	label: string
}
export const PrivacyPolicyInfo = ({ label }: Props) => {
	const policy = (
		<Link
			className='px-3 font-bold underline hover:no-underline text-neutral-500'
			href='/privacy'
		>
			Політика конфіденційності
		</Link>
	)

	return (
		<div>
			<p className='text-[12px] text-neutral-500 py-1'>
				{`Натискаючи на кнопку ${label}, я погоджуюсь з`}
				{policy}
				{`ТОВ “DEZZE”`}
			</p>
		</div>
	)
}
