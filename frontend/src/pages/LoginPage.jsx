import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e) => {
		e.preventDefault();
        await login(email, password);

	};
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<div className="flex flex-1 w-11/12 mx-auto h-96 shadow-lg rounded-lg m-6">
				{/* Left Side - Form */}
				<div className="w-1/2 p-12 flex flex-col justify-center font-opensans">
					<div className="max-w-md mx-auto w-full">
						<h1 className="text-2xl font-bold text-center text-gray-900 mb-1 font-k2d">
							Welcome to FurFind
						</h1>
						<p className="text-gray-600 mb-8 text-center text-sm">
							Find Love, Adopt with Ease
						</p>

						<form onSubmit={handleLogin} className="space-y-6">
							<div>
								<label className="block text-sm text-gray-600 mb-2">Email address</label>
								<input
									type="email"
									placeholder="example@gmail.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A62DC]"
								/>
							</div>

							<div>
								<label className="block text-sm text-gray-600 mb-2">Password</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7A62DC]"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<input
										type="checkbox"
										id="remember"
										className="h-4 w-4 text-[#7A62DC] focus:ring-[#7A62DC] border-gray-300 rounded"
									/>
									<label htmlFor="remember" className="ml-2 text-sm text-gray-600">
										Remember me
									</label>
								</div>
								<Link to="/forgot-password" className="text-sm text-[#7A62DC] hover:underline">
									Forgot Password?
								</Link>
							</div>
							{error && <p className="text-red-500 text-sm mb-2">{error}</p>}

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-[#7A62DC] text-white py-3 px-4 rounded-lg hover:bg-[#6952bd] transition duration-200"
							>
								{isLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Sign in"}
							</button>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-200"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-4 bg-white text-gray-500">or</span>
								</div>
							</div>

							<button
								type="button"
								onClick={() => {
									window.location.href = 'http://localhost:5000/api/auth/google';
								}}
								className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
							>
								<svg viewBox="0 0 24 24" width="20" height="20">
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Sign in with Google
							</button>
						</form>

						<p className="mt-6 text-center text-sm text-gray-600">
							Don't have an account?{" "}
							<Link to="/signup" className="text-[#7A62DC] hover:underline">
								Sign up
							</Link>
						</p>
					</div>
				</div>

				{/* Right Side - Image */}
				<div className="w-1/2 bg-gray-100 flex items-center justify-center rounded-r-lg shadow-lg">
					<div className="w-full h-full">
						<img
							src="/public/images/cat.png"
							alt="Cute pug in denim jacket"
							className="w-full h-screen object-cover rounded-r-lg"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage