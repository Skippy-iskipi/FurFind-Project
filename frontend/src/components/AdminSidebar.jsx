import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';


const AdminSidebar = ({ isMenuOpen}) => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

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
        <div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
            <nav className="p-4 space-y-2">
                <div className="flex items-center justify-center mb-4">
                    <img src="/images/logo.png" alt="Logo" className="h-16" />
                </div>
                <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                    Dashboard
                </button>
                <button onClick={() => navigate('/my-profile')} className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                    My Profile
                </button>
                <button onClick={() => navigate('/my-applications')} className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                    My Applications
                </button>
                <button onClick={() => navigate('/adoption-history')} className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                    Adoption History
                </button>
                <button onClick={() => navigate('/adoption-request')} className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                    Adoption Request
                </button>
                <button onClick={() => navigate('/help-faqs')} className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                    Help & FAQs
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors">
                    Log out
                </button>
            </nav>
        </div>
    );
};

export default AdminSidebar;
