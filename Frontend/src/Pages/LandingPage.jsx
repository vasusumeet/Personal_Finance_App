import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/Images/landingpageImage.jpg';
import spinner from '../Components/spinner';

      const LandingPage = () => {
  const [loading,setLoading]=useState(false)
  const [isScrolled, setIsScrolled] = useState(false);

  const handleArrowClick = () => {
    const nextSection = document.getElementById('next-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsScrolled(true);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const screenHeight = window.innerHeight;

    if (scrollTop > screenHeight / 2) {
      setIsScrolled(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    
    <div className="h-screen w-full overflow-x-hidden bg-red-900 snap-y snap-mandatory overflow-scroll">
      <div
        className="relative h-full w-full bg-cover bg-center snap-start"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Your Text Can Go Here */}
        <div className="absolute top-1/3 w-full text-center text-white px-4">
          <h1 className="text-4xl font-extrabold">Welcome to My Personal Finance App</h1>
          <p className="text-xl mt-4">Manage your finances with ease.</p>
        </div>
        
        <div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={handleArrowClick}
        >
          <svg
            className="w-12 h-12 text-black animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <div id="next-section" className="h-full flex flex-col items-center justify-center bg-darkslategray snap-start">
        <Link to='/LoginPage'>
        <button className="rounded-full bg-black hover:bg-white hover:text-black hover:shadow-inner text-white text-2xl py-4 px-12 mb-8">
          Login
        </button>
        </Link>
        <Link to='/SignUp'>
        <button className="rounded-full bg-white text-black hover:text-white hover:bg-black text-2xl py-4 px-12 mb-8">
          Signup
        </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
