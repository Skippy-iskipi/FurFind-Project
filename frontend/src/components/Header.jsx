import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#F5F5F5]w-full">
      <div className="w-11/12 mx-auto flex justify-between items-center pt-4 pb-4">
        <Link to="/" className="text-2xl font-bold text-[#7A62DC]">
          <img src="/public/images/logo.png" alt="FurFind Logo" className="h-12 inline-block mr-2" />
        </Link>
        <nav className="space-x-6 font-k2d">
          <Link to="/" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">Home</Link>
          <Link to="/adoption-guide" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">Adoption Guide</Link>
          <Link to="/browse-pets" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">Browse Pets</Link>
          <Link to="/why-choose-us" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">Why Choose FurFind?</Link>
          <Link to="/testimonials" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">Testimonials</Link>
          <Link to="/faqs" className="text-gray-700 hover:text-[#f5f5f5] hover:bg-[#7A62DC] px-3 py-3 rounded-md">FAQs</Link>
        </nav>
        <Link to="/login" className="bg-[#7A62DC] text-white py-2 px-6 rounded-md hover:bg-[#6952bd] transition duration-200">
          Sign in
        </Link>
      </div>
    </header>
  );
};

export default Header;
