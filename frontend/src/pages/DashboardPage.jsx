import { useState, useEffect } from 'react';
import PostPetModal from './PostPetModal';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Filter, Menu, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';
import PetDetailsModal from '../components/PetDetailsModal';
import MyApplications from '../components/MyApplications';
import AdoptionRequest from '../components/AdoptionRequest';
import AdoptionHistory from '../components/AdoptionHistory';
import PreferenceModal from '../components/PreferenceModal';
import NotificationDropdown from '../components/NotificationDropdown';
import { BiBell, BiMessage } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MessageNotification from '../components/MessageNotification';


const DashboardPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();
	const [showFilters, setShowFilters] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('Available Pets');
	const [isGenderVisible, setIsGenderVisible] = useState(true);
	const [classification, setClassification] = useState('All');
	const [selectedAges, setSelectedAges] = useState([]);
	const [selectedGenders, setSelectedGenders] = useState([]);
	const [selectedBreed, setSelectedBreed] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [pets, setPets] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedPet, setSelectedPet] = useState(null);
	const [showVerificationPopup, setShowVerificationPopup] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);
	const [recommendedPets, setRecommendedPets] = useState([]);
	const [unreadNotifications, setUnreadNotifications] = useState(0);
	const [showNotifications, setShowNotifications] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);

	const handlePostPetClick = () => {
		if (user.role === 'Adopter') {
			setShowVerificationPopup(true);
		} else if (user.role === 'Pet Owner' || user.role === 'Animal Shelter') {
			setIsModalOpen(true);
		}
	};

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

			console.log('Fetching with params:', params.toString()); // Debug log

			const response = await fetch(`http://localhost:5000/api/auth/pets?${params}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include'
			});

			const data = await response.json();
			if (data.success) {
				setPets(data.pets);
				await fetchRecommendedPets();
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

	const fetchRecommendedPets = async () => {
		try {
			console.log('Fetching recommended pets...'); // Debug log
			
			const response = await fetch('http://localhost:5000/api/auth/recommended-pets', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});

			console.log('Response status:', response.status); // Debug log

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Error response:', errorData); // Debug log
				throw new Error(errorData.message || 'Failed to fetch recommended pets');
			}

			const data = await response.json();
			console.log('Received data:', data); // Debug log

			if (data.success) {
				setRecommendedPets(data.pets || []);
			} else {
				throw new Error(data.message || 'Failed to fetch recommended pets');
			}
		} catch (error) {
			console.error('Error fetching recommendations:', error);
			setRecommendedPets([]); // Set empty array on error
		}
	};

	useEffect(() => {
		const loadData = async () => {
			await fetchFilteredPets();
			await fetchRecommendedPets();
		};
		
		loadData();
	}, []); // Empty dependency array if you only want to fetch once

	useEffect(() => {
		fetchFilteredPets();
	}, [classification, selectedAges, selectedGenders, selectedBreed, selectedLocation]);

	const handleUserSearch = async (query) => {
		setSearchQuery(query);
		
		if (query.trim() === '') {
		  setSearchResults([]);
		  setShowSearchResults(false);
		  return;
		}
	  
		try {
		  const response = await fetch(`http://localhost:5000/api/auth/users/search?query=${query}`, {
			credentials: 'include'
		  });
		  const data = await response.json();
		  
		  if (data.success) {
			setSearchResults(data.users);
			setShowSearchResults(true);
		  }
		} catch (error) {
		  console.error('Search error:', error);
		  toast.error('Failed to search users');
		}
	  };

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Sidebar Navigation */}
			<div className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
				<nav className="p-4 space-y-2">
					<div className="flex items-center justify-center mb-4">
						<img src="/images/logo.png" alt="Logo" className="h-16" />
					</div>
					<button
						onClick={() => navigate('/dashboard')}
						className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#6249c7] hover:text-white transition-colors"
					>
						Dashboard
					</button>
					<button
						onClick={() => navigate('/my-profile')}
						className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#6249c7] hover:text-white transition-colors"
					>
						My Profile
					</button>
					<button
						onClick={() => navigate('/dashboard')}
						className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#6249c7] hover:text-white transition-colors"
					>
						My Applications
					</button>
					<button
						onClick={() => navigate('/dashboard')}
						className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#6249c7] hover:text-white transition-colors"
					>
						Adoption History
					</button>
					<button
						onClick={() => navigate('/dashboard')}
						className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#6249c7] hover:text-white transition-colors"
					>
						Adoption Request
					</button>
					<button
						onClick={() => navigate('/dashboard')}
						className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#6249c7] hover:text-white transition-colors"
					>
						Help & FAQs
					</button>
					<button
						onClick={handleLogout}
						className="w-full text-left px-4 py-2 rounded-lg text-[#7A62DC] hover:bg-[#6249c7] hover:text-white transition-colors"
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
			<header className="bg-white shadow-sm">
				<div className="flex items-center justify-between px-4 py-3">
					{/* Left Section */}
					<div className="flex items-center gap-4">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-[#7A62DC]"
						>
							<Menu className="text-[#7A62DC]" />
						</button>
						<button
							onClick={() => setShowFilters(!showFilters)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showFilters ? 'bg-[#7A62DC] text-white' : 'border border-gray-300 text-gray-700'}`}
						>
							<Filter className={`w-5 h-5 ${showFilters ? 'text-white' : 'text-[#7A62DC]'}`} />
							<span className="font-medium">Filters</span>
						</button>
						<div className="relative w-96">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7A62DC] w-5 h-5" />
							<input
								type="text"
								placeholder="Search user..."
								value={searchQuery}
								onChange={(e) => handleUserSearch(e.target.value)}
								className="border border-gray-300 px-10 py-2 rounded-lg w-full focus:outline-none focus:border-[#7A62DC] focus:ring-1 focus:ring-[#7A62DC] transition-colors"
							/>
							
							{/* Search Results Dropdown */}
							{showSearchResults && searchResults.length > 0 && (
								<div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
									{searchResults.map((user) => (
										<div
											key={user._id}
											className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
											onClick={() => {
												navigate(`/user-profile/${user._id}`);
												setShowSearchResults(false);
												setSearchQuery('');
											}}
											>
											<img
												src={user.profilePicture || '/images/default-profile.jpg'}
												alt={user.name}
												className="w-8 h-8 rounded-full object-cover"
											/>
											<div>
												<p className="font-medium">{user.name}</p>
												<p className="text-sm text-gray-500">{user.role}</p>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Right Section */}
					<div className="flex items-center gap-4">
						<button
							onClick={() => setShowPreferences(true)}
							className="text-[#7A62DC] hover:text-[#6249c7]"
						>
							Set Preferences
						</button>

						{/* Message Icon with Notification */}
						<MessageNotification />

						{/* Notification Bell */}
						<div className="relative">
							<NotificationDropdown />
						</div>

						<button onClick={() => navigate('/my-profile')}>
							<img
								src={user.profilePicture || '/images/default-profile.jpg'}
								alt="Profile"
								className="w-8 h-8 rounded-full"
							/>
						</button>
						<button
							onClick={handlePostPetClick}
							className="bg-[#7A62DC] text-white px-4 py-2 rounded-md hover:bg-[#6249c7] transition-colors"
						>
							Post a Pet
						</button>
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
									className="text-[#7A62DC] text-sm hover:text-[#6249c7]"
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
										value={selectedAges[0] || ''}
										onChange={(e) => setSelectedAges([e.target.value])}
									>
										<option value="">Select Age...</option>
										<option value="Baby">Baby</option>
										<option value="Young">Young</option>
										<option value="Teenager">Teenager</option>
										<option value="Adult">Adult</option>
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
												? 'border-b-2 border-[#7A62DC] text-[#7A62DC]'
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
								<div>
									{recommendedPets.length > 0 && (
										<div className="mb-8">
											<h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
												{recommendedPets.map((pet) => (
													<div key={pet._id} className="bg-[#D4F5F5] rounded-2xl overflow-hidden p-4 hover:shadow-lg transition-shadow">
														{/* Pet Name and Posted Time */}
														<div className="flex justify-between items-center mb-3">
															<h3 className="text-lg font-medium text-gray-800">{pet.name}</h3>
															<span className="text-sm text-gray-500">
																{formatTimeAgo(pet.createdAt)}
															</span>
														</div>

														{/* Pet Image */}
														<div className="relative mb-3">
															<img
																src={pet.image}
																alt={pet.name}
																className="w-full h-48 object-cover rounded-lg"
															/>
															{/* Recommended Badge */}
															<span className="absolute top-2 left-2 bg-[#7A62DC] text-white px-2 py-1 rounded-full text-xs">
																Recommended
															</span>
															{/* Status Badge */}
															<span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
																pet.status === 'Available' 
																	? 'bg-green-500 text-white' 
																	: pet.status === 'Adopted' 
																		? 'bg-blue-500 text-white'
																		: 'bg-gray-500 text-white'
															}`}>
																{pet.status}
															</span>
														</div>

														{/* Pet Details */}
														<div className="space-y-2">
															{/* Classification Badge */}
															<div className="flex justify-between items-center gap-2">
																<span className="bg-[#7A62DC] text-white px-3 py-1 rounded-full text-sm">
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
															className="w-full mt-4 bg-[#7A62DC] text-white py-2 rounded-md hover:bg-[#6249c7] transition-colors"
															onClick={() => setSelectedPet(pet)}
														>
															View Details
														</button>
													</div>
												))}
											</div>
										</div>
									)}
									
									<h2 className="text-xl font-semibold mb-4">All Pets</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
										{loading && (
											<div className="col-span-full flex justify-center items-center py-8">
												<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
											</div>
										)}
										{loading ? (
											<div className="col-span-full flex justify-center items-center">
												<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
											</div>
										) : pets.length === 0 ? (
											<div className="col-span-full text-center text-gray-500">
												No pets available at the moment.
											</div>
										) : (
											pets.map((pet) => (
												<div key={pet._id} className="bg-[#D4F5F5] rounded-2xl overflow-hidden p-4 hover:shadow-lg transition-shadow">
													{/* Pet Name and Posted Time */}
													<div className="flex justify-between items-center mb-3">
														<h3 className="text-lg font-medium text-gray-800">{pet.name}</h3>
														<span className="text-sm text-gray-500">
															{formatTimeAgo(pet.createdAt)}
														</span>
													</div>

													{/* Pet Image */}
													<div className="relative mb-3">
														<img
															src={pet.image}
															alt={pet.name}
															className="w-full h-48 object-cover rounded-lg"
														/>
														{/* Status Badge */}
														<span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
															pet.status === 'Available' 
																? 'bg-green-500 text-white' 
																: pet.status === 'Adopted' 
																	? 'bg-blue-500 text-white'
																	: 'bg-gray-500 text-white'
														}`}>
															{pet.status}
														</span>
													</div>

													{/* Pet Details */}
													<div className="space-y-2">
														{/* Classification Badge */}
														<div className="flex justify-between items-center gap-2">
															<span className="bg-[#7A62DC] text-white px-3 py-1 rounded-full text-sm">
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
														className="w-full mt-4 bg-[#7A62DC] text-white py-2 rounded-md hover:bg-[#6249c7] transition-colors"
														onClick={() => setSelectedPet(pet)}
													>
														View Details
													</button>
												</div>
											))
										)}
									</div>
								</div>
							)}
							{activeTab === 'My Applications' && <MyApplications />}
							{activeTab === 'Adoption History' && <AdoptionHistory />}
							{activeTab === 'Adoption Request' && <AdoptionRequest userRole={user.role} />}
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

			{/* Verification Popup */}
			{showVerificationPopup && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-[#E0F4F4] p-6 rounded-lg shadow-lg">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-semibold font-lora">Only verified users are allowed to post</h2>
							<button
								onClick={() => setShowVerificationPopup(false)}
								className="text-[#7A62DC] text-2xl"
							>
								&times;
							</button>
						</div>
						<p className="mb-4 mt-10">Verified accounts are required for posting to ensure safe interactions</p>
						<div className="flex justify-end gap-4 mt-10">
							<button
								onClick={() => navigate('/verification-application')}
								className="bg-[#7A62DC] text-white px-4 py-2 rounded-md hover:bg-[#6249c7] transition-colors"
							>
								Get Verified
							</button>
							<button onClick={() => setShowVerificationPopup(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
								Later
							</button>
						</div>
					</div>
				</div>
			)}

			<PreferenceModal
				isOpen={showPreferences}
				onClose={() => setShowPreferences(false)}
				onSave={() => {
					fetchRecommendedPets();
				}}
			/>
		</div>
	);
};

export default DashboardPage;