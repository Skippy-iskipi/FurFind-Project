import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import LoadingSpinner from './components/LoadingSpinner'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import MyProfilePage from './pages/MyProfilePage'
import VerificationApplicationPage from './pages/VerificationApplication'
import AdoptionApplication from './pages/AdoptionApplication'
import AdminDashboard from './pages/AdminDashboard'



const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};


function App() {

  const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
			<Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />

        <Route path='/forgot-password' element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />

        <Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/my-profile'
					element={
						<ProtectedRoute>
							<MyProfilePage />
						</ProtectedRoute>
					}
				/>

				<Route
					path='/verification-application'
					element={
						<ProtectedRoute>
							<VerificationApplicationPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path='/admin-dashboard'
					element={
						<ProtectedRoute>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>

        <Route path="/adoption-application/:petId" element={<AdoptionApplication />} />

				{/* catch all routes */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
      <Toaster />
    </>
  )
}

export default App
