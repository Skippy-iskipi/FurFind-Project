import { useState } from 'react';
import PostPetModal from './PostPetModal';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DashboardPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
			toast.success('Logged out successfully');
		} catch (error) {
			toast.error('Failed to logout');
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Dashboard Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
						<div className="flex items-center gap-4">
							<span className="text-gray-600">Welcome, {user.name}</span>
							<button 
								onClick={() => setIsModalOpen(true)}
								className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
							>
								Post a Pet
							</button>
							<button 
								onClick={handleLogout}
								className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Dashboard Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1>TITE</h1>
			</main>

			{/* Post Pet Modal */}
			<PostPetModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default DashboardPage;