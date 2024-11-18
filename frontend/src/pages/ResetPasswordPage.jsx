import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center p-4'>
			<div className='max-w-md w-full bg-[#f5f5f5] backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden font-opensans'>
				<div className='p-8'>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#7A62DC] to-[#7A62DC]/80 text-transparent bg-clip-text'>
						Reset Password
					</h2>
					{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
					{message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

					<form onSubmit={handleSubmit}>
						<Input
							icon={Lock}
							type='password'
							placeholder='New Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<Input
							icon={Lock}
							type='password'
							placeholder='Confirm New Password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>

						<button
							className='w-full py-3 px-4 bg-[#7A62DC] text-white font-bold rounded-lg shadow-lg hover:bg-[#7A62DC]/90 focus:outline-none focus:ring-2 focus:ring-[#7A62DC] focus:ring-offset-2 disabled:opacity-50 transition duration-200'
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? "Resetting..." : "Set New Password"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default ResetPasswordPage;