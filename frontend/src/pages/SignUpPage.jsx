import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);
	const navigate = useNavigate();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

        try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<div className="flex flex-1 w-11/12 mx-auto h-96 shadow-lg rounded-lg m-6">
				{/* Left Side - Form */}
				<div className="w-1/2 p-12 flex flex-col justify-center font-opensans">
					<div className="max-w-md mx-auto w-full">
						<h1 className="text-3xl font-bold text-center text-gray-800 mb-2 font-k2d">
							Create Your Account
						</h1>
						<p className="text-gray-600 mb-8 text-center">
							Join FurFind to find your perfect pet
						</p>

						<form onSubmit={handleSignUp} className="space-y-4">
							<div>
								<label className="block text-sm text-gray-700 mb-1">Full Name</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A62DC]"
								/>
							</div>

							<div>
								<label className="block text-sm text-gray-700 mb-1">Email address</label>
								<input
									type="email"
									placeholder="example@gmail.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A62DC]"
								/>
							</div>

							<div>
								<label className="block text-sm text-gray-700 mb-1">Password</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A62DC]"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
                                {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
								<PasswordStrengthMeter password={password} />
							</div>

							<div className="flex items-center">
								<input
									type="checkbox"
									id="terms"
									checked={agreeToTerms}
									onChange={(e) => setAgreeToTerms(e.target.checked)}
									className="h-4 w-4 text-[#7A62DC] focus:ring-[#7A62DC] border-gray-300 rounded"
								/>
								<label htmlFor="terms" className="ml-2 text-sm text-gray-600">
									I agree to the{" "}
									<a href="#" className="text-[#7A62DC] hover:underline">
										Terms of Service
									</a>{" "}
									and{" "}
									<a href="#" className="text-[#7A62DC] hover:underline">
										Privacy Policy
									</a>
								</label>
							</div>

							<button
								type="submit"
                                disabled={isLoading}
								className="w-full bg-[#7A62DC] text-white py-2 px-4 rounded-md hover:bg-[#6952bd] transition duration-200"
							>
								{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Create Account"}
							</button>
						</form>

						<p className="mt-6 text-center text-sm text-gray-600">
							Already have an account?{" "}
							<Link to="/login" className="text-[#7A62DC] hover:underline">
								Sign in
							</Link>
						</p>
					</div>
				</div>

				{/* Right Side - Image */}
				<div className="w-1/2 bg-gray-100 flex items-center justify-center rounded-r-lg shadow-lg">
					<div className="w-full h-full">
						<img
						src="/public/images/dog.png"
						alt="Cute pug in denim jacket"
						className="w-full h-screen object-cover rounded-r-lg"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;