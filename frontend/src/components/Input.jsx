const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
				<Icon className='h-5 w-5 text-[#7A62DC]' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A62DC] focus:border-transparent'
			/>
		</div>
	);
};
export default Input;