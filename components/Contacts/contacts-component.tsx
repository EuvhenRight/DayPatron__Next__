interface Props {
	icon: JSX.Element
	text?: string
	link?: string
}

export const ContactsComponent = ({ icon, text, link }: Props) => {
	return (
		<div className={`flex items-center justify-start gap-4 ${link && 'pb-8'}`}>
			{icon}
			{link ? (
				<a href={link} className='hover:underline'>
					{text}
				</a>
			) : (
				<p className='flex items-end justify-start gap-2'>{text}</p>
			)}
		</div>
	)
}
