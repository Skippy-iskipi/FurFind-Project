import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		<div className='min-h-screen bg-[#f5f5f5] flex items-center justify-center relative overflow-hidden'>
			{/* Simple Loading Spinner */}
			<motion.div
				className='w-20 h-20 border-8 border-t-8 border-t-[#7A62DC] border-[#7A62DC]/30 rounded-full'
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			/>
		</div>
	);
};

export default LoadingSpinner;