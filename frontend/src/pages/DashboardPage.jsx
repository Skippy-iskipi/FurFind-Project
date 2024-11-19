import { useState, useEffect } from 'react';
import PostPetModal from './PostPetModal';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Bell, Filter, Menu, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';
import PetDetailsModal from '../components/PetDetailsModal';


const DashboardPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();
	const [showFilters, setShowFilters] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('Available Pets');
	const [isAgeVisible, setIsAgeVisible] = useState(true);
	const [isGenderVisible, setIsGenderVisible] = useState(true);
	const [classification, setClassification] = useState('All');
	const [selectedAges, setSelectedAges] = useState([]);
	const [selectedGenders, setSelectedGenders] = useState([]);
	const [selectedBreed, setSelectedBreed] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [pets, setPets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedPet, setSelectedPet] = useState(null);

	const dogBreeds = [
		'Aspin',
		'Labrador',
		'German Shepherd',
		'Golden Retriever',
		'American Bully',
		'Chow-chow',
		'Bulldog',
		'Poodle',
		'Beagle',
		'Rottweiler',
		'Dachshund',
		'Pomeranian',
		'Pug',
		'Chihuahua',
		'Husky',
		'Shih Tzu',
		'Mixed Breed'
	];

	const catBreeds = [
		'Puspin',
		'Persian',
		'Maine Coon',
		'Siamese',
		'British Shorthair',
		'Ragdoll',
		'American Shorthair',
		'Scottish Fold',
		'Sphynx',
		'Bengal',
		'Russian Blue',
		'Abyssinian',
		'Norwegian Forest Cat',
		'Domestic Shorthair',
		'Domestic Longhair',
		'Mixed Breed'
	];

	const locations = [
		"Abucay",
		"Bagac",
		"Balanga",
		"Dinalupihan",
		"Hermosa",
		"Limay",
		"Mariveles",
		"Morong",
		"Orani",
		"Orion",
		"Pilar",
		"Samal",
	];

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
			toast.success('Logged out successfully');
		} catch (error) {
			toast.error('Failed to logout');
		}
	};

	const tabs = [
		'Available Pets',
		'My Applications',
		'Adoption History',
		'Adoption Request'
	];

	const handleClearAll = () => {
		setClassification('All');
		setSelectedAges([]);
		setSelectedGenders([]);
		setSelectedBreed('');
		setSelectedLocation('');
	};

	const fetchFilteredPets = async () => {
		try {
			setLoading(true);

			const params = new URLSearchParams();
			if (classification && classification !== 'All') params.append('classification', classification);
			if (selectedAges.length > 0) params.append('age', selectedAges.join(','));
			if (selectedGenders.length > 0) params.append('gender', selectedGenders.join(','));
			if (selectedBreed) params.append('breed', selectedBreed);
			if (selectedLocation) params.append('location', selectedLocation);

			const response = await fetch(`http://localhost:5000/api/auth/pets?${params}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include'
			});

			const data = await response.json();
			if (data.success) {
				setPets(data.pets);
			} else {
				toast.error(data.message || 'Failed to fetch pets');
			}
		} catch (error) {
			console.error('Fetch error:', error);
			toast.error('Failed to fetch pets: ' + error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFilteredPets();
	}, [classification, selectedAges, selectedGenders, selectedBreed, selectedLocation]);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Sidebar Navigation */}
			<div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
				<nav className="p-4 space-y-2">
					<div className="flex items-center justify-center mb-4">
						<img src="/images/logo.png" alt="Logo" className="h-16" />
					</div>
					<button
						onClick={() => navigate('/')}
						className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
					>
						Dashboard
					</button>
					<button
						onClick={() => navigate('/my-profile')}
						className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
					>
						My Profile
					</button>
					<button
						onClick={() => navigate('/my-applications')}
						className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
					>
						My Applications
					</button>
					<button
						onClick={() => navigate('/adoption-history')}
						className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
					>
						Adoption History
					</button>
					<button
						onClick={() => navigate('/adoption-request')}
						className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
					>
						Adoption Request
					</button>
					<button
						onClick={() => navigate('/help-faqs')}
						className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
					>
						Help & FAQs
					</button>
					<button
						onClick={handleLogout}
						className="w-full text-left px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-600 hover:text-white transition-colors"
					>
						Log out
					</button>
				</nav>
			</div>

			{/* Overlay */}
			{isMenuOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={() => setIsMenuOpen(false)}
				/>
			)}

			{/* Dashboard Header */}
			<header className="bg-white shadow">
				<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex justify-between items-center">
						{/* Left Section */}
						<div className="flex items-center gap-4">
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="text-purple-600"
							>
								<Menu className="text-purple-600" />
							</button>
							<button
								onClick={() => setShowFilters(!showFilters)}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? 'bg-purple-600 text-white' : 'border border-gray-300 text-gray-700'}`}
							>
								<Filter className={`w-5 h-5 ${showFilters ? 'text-white' : 'text-purple-600'}`} />
								<span className="font-medium">Filters</span>
							</button>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 w-5 h-5" />
								<input
									type="text"
									placeholder="Search pets..."
									className="border border-gray-300 px-10 py-2 rounded-lg w-96"
								/>
							</div>
						</div>

						{/* Right Section */}
						<div className="flex items-center gap-4">
							<Bell className="text-purple-600" />
							<span className="text-gray-600">Welcome, {user.name}</span>
							<button
								onClick={() => setIsModalOpen(true)}
								className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
							>
								Post a Pet
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Dashboard Content */}
			<main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex gap-8">
					{/* Filters Section */}
					{showFilters && (
						<div className="w-64 bg-white rounded-lg p-4">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<Filter className="w-4 h-4" />
									<span className="font-medium">Filters</span>
								</div>
								<button
									onClick={handleClearAll}
									className="text-purple-600 text-sm hover:text-purple-700"
								>
									Clear all
								</button>
							</div>

							<div className="space-y-4">
								{/* Classification Select */}
								<div>
									<label className="block mb-2 text-sm">Classification</label>
									<select
										className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
										value={classification}
										onChange={(e) => setClassification(e.target.value)}
									>
										<option value="All">All</option>
										<option value="Dog">Dog</option>
										<option value="Cat">Cat</option>
									</select>
								</div>

								{/* Age Select */}
								<div>
									<label className="block mb-2 text-sm">Age</label>
									<select
										className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
										value={selectedAges}
										onChange={(e) => setSelectedAges([e.target.value])}
									>
										<option value="">Select Age...</option>
										<option value="Puppy/Kitten">Puppy/Kitten</option>
										<option value="Young">Young</option>
										<option value="Adult">Adult</option>
										<option value="Senior">Senior</option>
									</select>
								</div>

								{/* Gender Select */}
								<div className="space-y-2">
									<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsGenderVisible(!isGenderVisible)}>
										<label className="text-sm">Gender</label>
										<button className="p-1">
											{isGenderVisible ? (
												<ChevronUp className="w-4 h-4" />
											) : (
												<ChevronDown className="w-4 h-4" />
											)}
										</button>
									</div>

									{isGenderVisible && (
										<div className="space-y-2">
											{['Male', 'Female'].map((gender) => (
												<label key={gender} className="flex items-center text-sm">
													<input
														type="checkbox"
														checked={selectedGenders.includes(gender)}
														onChange={(e) => {
															if (e.target.checked) {
																setSelectedGenders([...selectedGenders, gender]);
															} else {
																setSelectedGenders(selectedGenders.filter(g => g !== gender));
															}
														}}
														className="mr-2 rounded border-gray-300"
													/>
													{gender}
												</label>
											))}
										</div>
									)}
								</div>

								{/* Breed Select */}
								<div>
									<label className="block mb-2 text-sm">Breed</label>
									<select
										className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
										value={selectedBreed}
										onChange={(e) => setSelectedBreed(e.target.value)}
									>
										<option value="">Select Breed...</option>
										{classification === 'Dog'
											? dogBreeds.map(breed => (
													<option key={breed} value={breed}>{breed}</option>
												))
											: catBreeds.map(breed => (
													<option key={breed} value={breed}>{breed}</option>
												))
										}
									</select>
								</div>

								{/* Location Select */}
								<div>
									<label className="block mb-2 text-sm">Location</label>
									<select
										className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
										value={selectedLocation}
										onChange={(e) => setSelectedLocation(e.target.value)}
									>
										<option value="">Select Location...</option>
										{locations.map(location => (
											<option key={location} value={location}>{location}</option>
										))}
									</select>
								</div>
							</div>
						</div>
					)}

					{/* Main Content Area with Tabs */}
					<div className="flex-1">
						<div className="border-b border-gray-200">
							<nav className="flex space-x-8">
								{tabs.map((tab) => (
									<button
										key={tab}
										onClick={() => setActiveTab(tab)}
										className={`pb-4 text-sm ${
											activeTab === tab
												? 'border-b-2 border-purple-600 text-purple-600'
												: 'text-gray-500 hover:text-gray-700'
										}`}
									>
										{tab}
									</button>
								))}
							</nav>
						</div>

						{/* Tab Content */}
						<div className="mt-6">
							{activeTab === 'Available Pets' && (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
									{loading && (
										<div className="col-span-full flex justify-center items-center py-8">
											<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
										</div>
									)}
									{loading ? (
										<div className="col-span-full flex justify-center items-center">
											<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
										</div>
									) : pets.length === 0 ? (
										<div className="col-span-full text-center text-gray-500">
											No pets available at the moment.
										</div>
									) : (
										pets.map((pet) => (
											<div key={pet._id} className="bg-[#E0F4F4] rounded-2xl overflow-hidden p-4 hover:shadow-lg transition-shadow">
												{/* Pet Name and Posted Time */}
												<div className="flex justify-between items-center mb-3">
													<h3 className="text-lg font-medium text-gray-800">{pet.name}</h3>
													<span className="text-sm text-gray-500">
														{formatTimeAgo(pet.createdAt)}
													</span>
												</div>
												
												{/* Pet Image */}
												<div className="mb-3">
													<img
														src={pet.image}
														alt={pet.name}
														className="w-full h-48 object-cover rounded-lg"
													/>
												</div>

												{/* Pet Details */}
												<div className="space-y-2">
													{/* Classification Badge */}
													<div className="flex justify-between items-center gap-2">
														<span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
															{pet.classification}
														</span>
														<span className="text-gray-600">
															Age: {pet.age}
														</span>
													</div>
													<div className="flex justify-between items-center gap-2 text-gray-600">
														<p>Breed: {pet.breed}</p>
														<p>Location: {pet.location}</p>
													</div>
												</div>

												{/* View Details Button */}
												<button
													className="w-full mt-4 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
													onClick={() => setSelectedPet(pet)}
												>
													View Details
												</button>
											</div>
										))
									)}
								</div>
							)}
							{activeTab === 'My Applications' && (
								<div>Your applications will appear here.</div>
							)}
							{activeTab === 'Adoption History' && (
								<div>Your adoption history will appear here.</div>
							)}
							{activeTab === 'Adoption Request' && (
								<div>Your adoption requests will appear here.</div>
							)}
						</div>
					</div>
				</div>
			</main>

			{/* Post Pet Modal */}
			<PostPetModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			{selectedPet && (
				<PetDetailsModal 
					pet={selectedPet} 
					onClose={() => setSelectedPet(null)} 
				/>
			)}
		</div>
	);
};

export default DashboardPage;