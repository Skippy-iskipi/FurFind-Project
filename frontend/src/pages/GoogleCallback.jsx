import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const { set } = useAuthStore();

    useEffect(() => {
        const handleCallback = () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');
                const userDataStr = params.get('userData');

                if (!token || !userDataStr) {
                    console.error('Missing token or user data');
                    navigate('/login');
                    return;
                }

                const userData = JSON.parse(decodeURIComponent(userDataStr));

                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Update auth store
                set({
                    user: userData,
                    isAuthenticated: true,
                    error: null
                });

                // Navigate to dashboard
                navigate('/dashboard');
            } catch (error) {
                console.error('Error processing Google callback:', error);
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, set]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Processing login...</p>
        </div>
    );
};

export default GoogleCallback; 