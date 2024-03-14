import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputProps {
	id: string
	label: string
	type: string
	disabled?: boolean
	required?: boolean
	register?: UseFormRegister<FieldValues>
	errors?: FieldErrors
}

const Input: React.FC<InputProps> = ({
	id,
	label,
	type,
	disabled,
	required,
	register,
	errors,
}) => {
	return (
		<div className='w-full relative'>
			<input
				id={id}
				type={type}
				disabled={disabled}
				{...register!(id, {
					required,
				})}
				placeholder=''
				className={`peer w-full p-5 outline-none border-2 font-light transition disabled:opacity-70 disabled:cursor-not-allowed 
        ${errors && errors[id] ? 'border-red-500' : 'border-neutral-300'}
        ${
					errors && errors[id]
						? 'focus:border-red-500'
						: 'focus:border-slate-400'
				}	
    `}
			/>
			<label
				htmlFor={id}
				className={`absolute cursor-text text-md duration-150 transform -translate-y-4 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4
			${errors && errors[id] ? 'text-red-500' : 'text-zinc-400'}`}
			>
				{label}
			</label>
			{errors && errors[id] && (
				<p className='text-red-500'>{errors[id]?.message?.toString()}</p>
			)}
		</div>
	)
}

export default Input
