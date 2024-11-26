import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

const isTokenExpired = (token) => {
	const payload = JSON.parse(atob(token.split('.')[1]));
	return payload.exp * 1000 < Date.now();
};

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	set: (newState) => set((state) => ({ ...state, ...newState })),

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		await new Promise(resolve => setTimeout(resolve, 2000));
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });

			// Check if the login is successful
			if (response.data.success) {
				const token = response.data.token;
				console.log('Token received:', token);

				if (isTokenExpired(token)) {
					console.error('Token is expired');
					// Handle token expiration (e.g., redirect to login)
				}
				localStorage.setItem('token', token);

				// Check if the user is the admin
				if (email === "furfindadmin@furfind.com") {
					console.log('Admin logged in with token:', token);

					// Redirect to admin dashboard
					window.location.href = '/admin-dashboard';
				}

				// Update the state
				set({
					isAuthenticated: true,
					user: response.data.user,
					error: null,
					isLoading: false,
				});
			} else {
				console.error('Login failed:', response.data.message);
			}
		} catch (error) {
			console.error('Error during login:', error);
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({
				user: response.data.user,
				isAuthenticated: true,
				isCheckingAuth: false
			});
		} catch (error) {
			set({
				user: null,
				isAuthenticated: false,
				error: null,
				isCheckingAuth: false
			});
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		await new Promise(resolve => setTimeout(resolve, 2000));
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));