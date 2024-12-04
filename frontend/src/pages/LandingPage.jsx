import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isPetOwnerOpen, setIsPetOwnerOpen] = useState(false);
  const [isShelterOpen, setIsShelterOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I adopt a pet through FurFind?",
      answer: "To adopt, sign up on our platform, browse the available pets, and submit an adoption application for the pet you are interested in. The pet owner or shelter will review your application and contact you for the next steps."
    },
    {
      id: 2,
      question: "What information do I need to provide when applying for adoption?",
      answer: "You'll need to provide valid government ID, proof of residence, proof of income, and complete our adoption application form which includes questions about your living situation and pet care experience."
    },
    {
      id: 3,
      question: "Can I adopt multiple pets at once?",
      answer: "Yes, you can adopt multiple pets. However, we recommend carefully considering your capacity to care for multiple pets in terms of time, space, and resources."
    },
    {
      id: 4,
      question: "Can I return a pet after adoption?",
      answer: "While we encourage committed adoption, we understand circumstances may change. Please contact the shelter or owner directly to discuss any issues, as return policies vary by shelter."
    },
    {
      id: 5,
      question: "How do I report an issue with a pet or owner?",
      answer: "You can report issues through our platform's reporting system. Navigate to the relevant profile or listing and click the 'Report Issue' button. Our team will review and respond promptly."
    }
  ];

  // Fetch pets from the backend
  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/pets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setPets(data.pets.slice(0, 20))
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
    fetchPets();
  }, []);




  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      {/* Hero Section */}
      <section className="w-[90%] mx-auto px-4 py-16 flex items-center">
        <div className="w-1/2 relative bottom-20">
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-[#58E6E0] font-lora">Connecting </span>
            <span className="text-[#7A62DC] font-lora">HEARTS</span>
            <br />
            <span className="text-[#58E6E0] font-lora">and </span>
            <span className="text-[#7A62DC] font-lora">PAWS</span>
          </h1>
          <p className="text-gray-600 mb-8">
            FurFind streamlines pet adoption in Bataan, connecting adopters with local shelters and individual owners for accessible, transparent processes.
          </p>
          <Link to="/signup" className="bg-[#7A62DC] text-white py-2 px-6 rounded-md hover:bg-[#6952bd] transition duration-200">
            Get Started
          </Link>
        </div>
        <div className="w-1/2">
          <img
            src="./public/images/hero1.png"
            alt="Pet adoption illustration"
            className="w-full"
          />
        </div>
      </section>

      {/* Decorative Banner */}
      <div className="w-full relative">
        <div className="w-full h-48 relative">
          {/* Background Image */}
          <img 
            src="./public/images/bannerbg.png" 
            alt="" 
            className="w-full h-full object-cover absolute inset-0"
          />

          {/* Left side pets (cyan colored) */}
            <div className="absolute left-30 -top-10 z-5">
              <img 
                src="./public/images/banner1.png"
                alt="" 
                className="h-64 object-contain relative z-5 ml-20"
              />
            </div>

          {/* Right side pets (purple colored) */}
          <div className="absolute right-24 -bottom-2 z-5">
            <img 
              src="./public/images/banner2.png" 
              alt="" 
              className="h-64 object-contain relative z-5"
            />
          </div>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="./public/images/bannertext.png" 
              alt="FIND LOVE, ADOPT WITH EASE." 
              className="h-12 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Adoption Guide Section */}
      <section className="w-[90%] mx-auto py-16">
        <h2 className="text-4xl font-bold text-center mb-2 font-lora">Adoption Guide</h2>
        <p className="text-gray-600 text-center mb-12">
          Everything you need to know about adopting or listing a pet on FurFind
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Pet Adopters */}
          <div className="border border-2 rounded-md p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-2 font-lora">For Pet Adopters</h3>
            <p className="text-gray-600 mb-6">Documents needed and steps to adopt a pet</p>
            
            {/* Required Documents Dropdown */}
            <div className="mb-4">
              <button 
                onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
                className="w-full flex items-center justify-between p-4 bg-[#D4F5F5] rounded-lg text-left"
              >
                <div className="flex items-center">
                  <img src="/public/images/application1.png" alt="" className="w-6 h-6 mr-3" />
                  <span className="font-medium">Required Documents</span>
                </div>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-200 ${isDocumentsOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Content */}
              {isDocumentsOpen && (
                <div className="mt-2 p-4 bg-[#D4F5F5] rounded-lg border border-gray-100">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Valid Government ID</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Proof of Residence</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Proof of Income</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Adoption Process Dropdown */}
            <div>
              <button 
                onClick={() => setIsProcessOpen(!isProcessOpen)}
                className="w-full flex items-center justify-between p-4 bg-[#D4F5F5] rounded-lg text-left"
              >
                <div className="flex items-center">
                  <img src="/public/images/adopt.png" alt="" className="w-6 h-6 mr-3" />
                  <span className="font-medium">Adoption Process</span>
                </div>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-200 ${isProcessOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Content */}
              {isProcessOpen && (
                <div className="mt-2 p-4 bg-[#D4F5F5] rounded-md border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    The adopter is required to complete the application form, provide the necessary documents, and await the review and verification of their adoption application by the Pet Owner or Animal Shelter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* For Pet Owners & Shelters */}
          <div className="border border-2 rounded-md p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-2 font-lora">For Pet Owners & Shelters</h3>
            <p className="text-gray-600 mb-6">Required verification documents to list pets</p>
            
            {/* For Pet Owners Dropdown */}
            <div className="mb-4">
              <button 
                onClick={() => setIsPetOwnerOpen(!isPetOwnerOpen)}
                className="w-full flex items-center justify-between p-4 bg-[#D4F5F5] rounded-lg text-left"
              >
                <div className="flex items-center">
                  <img src="/public/images/user.png" alt="" className="w-6 h-6 mr-3" />
                  <span className="font-medium">For Pet Owners</span>
                </div>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-200 ${isPetOwnerOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Content */}
              {isPetOwnerOpen && (
                <div className="mt-2 p-4 bg-[#D4F5F5] rounded-md border border-gray-100">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Valid Government ID</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Proof of Residence</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* For Shelters Dropdown */}
            <div>
              <button 
                onClick={() => setIsShelterOpen(!isShelterOpen)}
                className="w-full flex items-center justify-between p-4 bg-[#D4F5F5] rounded-lg text-left"
              >
                <div className="flex items-center">
                  <img src="/public/images/animal-shelter.png" alt="" className="w-6 h-6 mr-3" />
                  <span className="font-medium">For Shelters</span>
                </div>
                <svg 
                  className={`w-5 h-5 transform transition-transform duration-200 ${isShelterOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Content */}
              {isShelterOpen && (
                <div className="mt-2 p-4 bg-[#D4F5F5] rounded-md border border-gray-100">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Registration Certificate</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Tax Exemption Document (if applicable)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#7A62DC] rounded-full mr-3"></div>
                      <span className="text-gray-700">Facility Photos</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="w-[90%] mx-auto py-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-5xl font-bold font-lora">Featured Cute Pets for Adoption</h2>
          <a href="/browse-pets" className="text-[#7A62DC] flex items-center border border-1 border-[#7A62DC] rounded-full px-3 py-2 hover:bg-[#7A62DC] hover:text-white transition-colors">
            Browse all Pets
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <p className="text-gray-600 mb-8 w-[50%] text-sm">
          Our platform simplifies the adoption process by creating a secure and efficient space for adopters, pet owners, and shelters. We aim to promote responsible pet ownership and enhance the adoption experience for our community.
        </p>

        {/* Slider Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-48 from-[#F5F5F5] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-48 from-[#F5F5F5] to-transparent z-10"></div>
          
          {/* Scrolling Content */}
          <div className="flex animate-scroll hover:pause gap-6">
            {loading ? (
              <div className="flex justify-center w-full py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A62DC]"></div>
              </div>
            ) : (
              [...pets, ...pets].map((pet, index) => (
                <div 
                  key={`${pet._id}-${index}`} 
                  className="flex-none w-[320px] bg-[#D4F5F5] rounded-3xl overflow-hidden"
                >
                  {/* Pet Name */}
                  <h3 className="text-xl font-medium text-gray-800 p-5 pb-3">{pet.name}</h3>

                  {/* Pet Image */}
                  <div className="relative">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      className="w-full h-52 object-cover pl-5 pr-5"
                    />
                    {/* Status Badge */}
                    <span className="absolute top-3 right-7 px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                      Available
                    </span>
                  </div>

                  {/* Pet Details */}
                  <div className="p-2 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-[#7A62DC] text-white px-4 py-1 rounded-full text-sm">
                        {pet.classification}
                      </span>
                      <span className="text-gray-600">
                        {pet.age}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-5">
                      <div className="text-gray-600">
                        <span className="mr-1">Breed:</span>
                        <span>{pet.breed}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="mr-1">Location:</span>
                        <span>{pet.location}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-[#7A62DC] text-white py-3 rounded-md font-medium hover:opacity-95 transition-opacity"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose FurFind Section */}
      <section className="w-[90%] mx-auto py-10 flex">
        {/* Left Side - Image */}
        <div className="w-[50%] relative top-16">
          <div className="rounded-3xl overflow-hidden relative">
            <img 
              src="/images/whychoose.png"
              alt="Happy adopters with their pet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-[50%] relative top-32">
          <h2 className="text-5xl font-bold mb-3 font-lora">Why Choose FurFind?</h2>
          <p className="text-gray-600 mb-8 text-m text-justify">
            FurFind offers a smooth pet adoption experience, ensuring safety and efficiency while 
            promoting responsible ownership and connecting loving families with pets.
          </p>

          {/* Features in horizontal layout */}
          <div className="grid grid-cols-3 gap-12">
            {/* For Adopters */}
            <div>
              <h3 className="text-[#7A62DC] font-semibold mb-2 text-2xl">For Adopters</h3>
              <p className="text-gray-600 text-m text-justify">
                Access a comprehensive database of available pets in Bataan, with detailed profiles 
                and streamlined adoption processes.
              </p>
            </div>

            {/* For Pet Owners */}
            <div>
              <h3 className="text-[#7A62DC] font-semibold mb-2 text-2xl">For Pet Owners</h3>
              <p className="text-gray-600 text-m text-justify">
                Connect with responsible adopters and ensure your pets find loving forever homes 
                through our verified platform.
              </p>
            </div>

            {/* For Shelters */}
            <div>
              <h3 className="text-[#7A62DC] font-semibold mb-2 text-2xl">For Shelters</h3>
              <p className="text-gray-600 text-m text-justify">
                Expand your reach and streamline operations with our digital platform designed to 
                support animal welfare organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="w-[90%] mx-auto py-16">
        <h2 className="text-5xl font-bold text-center mb-10">Success Stories from FurFind Community</h2>
        <p className="text-gray-600 text-center mb-16 text-m w-[50%] mx-auto">
          FurFind celebrates heartwarming adoption journeys, showcasing success stories of community 
          members who found their perfect furry companions through our platform.
        </p>

        {/* Stories Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-[#7A62DC] text-white p-3 rounded-full z-10">
            <svg className="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-[#7A62DC] text-white p-3 rounded-full z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Stories Container */}
          <div className="flex gap-6 justify-center">
            {/* Story Card 1 */}
            <div className="w-[380px] bg-[#D4F5F5] rounded-3xl p-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/images/dog.png"
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 text-center mb-40">
              Using FurFind has greatly improved my adoption experience, making the process much more seamless and efficient. The platform makes everything straightforward.
              </p>

              <h3 className="text-xl font-semibold text-center mb-1">
                Johnny Sins
              </h3>
              <p className="text-[#7A62DC] text-center">
                Adopter
              </p>
            </div>

            {/* Story Card 2 (Middle/Featured) */}
            <div className="w-[380px] bg-[#D4F5F5] rounded-3xl p-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/images/cat.png"
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 text-center mb-6">
                When I faced the difficult decision of needing to rehome my beloved dog, 
                I turned to FurFind, and I was pleasantly surprised by how effectively it 
                helped me connect with a loving family. The entire process was not only 
                transparent, allowing me to feel confident in each step, but also incredibly 
                secure, ensuring that both my dog and I felt supported throughout the journey.
              </p>

              <h3 className="text-xl font-semibold text-center mb-1">
                Shelter ni Mang Kepweng
              </h3>
              <p className="text-[#7A62DC] text-center">
                Bahay Shelter Bataan
              </p>
            </div>

            {/* Story Card 3 */}
            <div className="w-[380px] bg-[#D4F5F5] rounded-3xl p-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/images/dog.png"
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-600 text-center mb-40">
              As an adopter, I've experienced a smoother and more efficient adoption process since using FurFind. The platform simplifies everything.
              </p>

              <h3 className="text-xl font-semibold text-center mb-1">
                Johnny Bravo
              </h3>
              <p className="text-[#7A62DC] text-center">
                Adopter
              </p>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <div className="flex justify-center mt-12">
          <button className="bg-[#7A62DC] text-white px-8 py-3 rounded-lg">
            Read More
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-[90%] mx-auto py-16">
        <h2 className="text-5xl font-bold mb-12 font-lora">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="bg-[#D4F5F5] rounded-lg overflow-hidden">
              <button 
                className="w-full p-4 text-left flex justify-between items-center"
                onClick={() => handleFaqClick(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-[#7A62DC] text-2xl">
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-[90%] mx-auto mb-16 mt-32">
        <div className="relative rounded-3xl">
          <img
            src="/images/joinbg.png"
            alt=""
            className="w-[80%] h-[350px] object-cover absolute inset-0 rounded-2xl"
          />

          <div className="relative flex justify-between p-12">

            <div className="w-1/2 mx-auto w-[50%]">
              <img
                src="/images/Join.png"
                alt="Join FurFind Today"
                className="mb-4 w-[400px] mx-auto"
              />
              <p className="text-gray-700 mb-8 text-m text-center">
                Whether you're looking to adopt, rehome a pet, or represent a shelter,
                get started with FurFind today.
              </p>


              <div className="space-y-4 mt-12">
                <button 
                  onClick={() => navigate('/signup')} 
                  className="w-full bg-[#7A62DC] text-white py-3 rounded-lg hover:bg-[#6952bd] transition-colors"
                >
                  Create Account
                </button>
                <button className="w-full bg-white text-[#7A62DC] py-3 rounded-lg border border-[#7A62DC] hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            <div className="w-1/2 flex justify-end relative">
              <img
                src="/images/joinpic.png"
                alt="Adopt Don't Shop"
                className="w-[80%] relative left-8 bottom-32 transform scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F5F5] w-full border-t border-gray-200">
        <div className="w-11/12 mx-auto py-8">
          <div className="flex items-center gap-52">
            <Link to="/" className="text-2xl font-bold text-[#7A62DC]">
              <img
                src="/images/logo.png"
                alt="FurFind Logo"
                className="h-12 inline-block mr-2"
              />
            </Link>
            
            <nav className="space-x-6 font-k2d">
              <Link to="/" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">
                Home
              </Link>
              <Link to="/adoption-guide" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">
                Adoption Guide
              </Link>
              <Link to="/browse-pets" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">
                Browse Pets
              </Link>
              <Link to="/why-choose-us" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">
                Why Choose FurFind?
              </Link>
              <Link to="/testimonials" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">
                Testimonials
              </Link>
              <Link to="/faqs" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">
                FAQs
              </Link>
            </nav>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 text-gray-600">
            © 2024 FurFind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
