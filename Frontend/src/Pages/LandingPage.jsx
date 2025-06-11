import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/Images/landingpageImage.jpg';

const LandingPage = () => {
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
    <div className="h-screen w-full overflow-x-hidden bg-gray-900 snap-y snap-mandatory overflow-scroll">
      
      {/* Hero Section */}
      <div
        className="relative h-full w-full bg-cover bg-center snap-start flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            Take Control of Your
            <span className="block text-blue-400">Financial Future</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Track expenses, manage budgets, and achieve your financial goals with our intuitive personal finance platform.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 text-sm md:text-base">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Smart Analytics</h3>
              <p className="text-gray-300 text-sm">Visual insights into your spending patterns</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Budget Goals</h3>
              <p className="text-gray-300 text-sm">Set and track your financial objectives</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold mb-1">Secure & Private</h3>
              <p className="text-gray-300 text-sm">Your financial data is protected</p>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
          onClick={handleArrowClick}
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2 opacity-75 group-hover:opacity-100 transition-opacity">
              Get Started
            </span>
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-white animate-bounce group-hover:text-blue-400 transition-colors"
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
      </div>

      {/* Authentication Section */}
      <div 
        id="next-section" 
        className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 snap-start px-4"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial habits with our platform.
          </p>
        </div>

        {/* Authentication Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md">
          <Link to='/LoginPage' className="flex-1">
            <button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-xl font-semibold py-4 px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none">
              Login
            </button>
          </Link>
          
          <Link to='/SignUp' className="flex-1">
            <button className="w-full rounded-full bg-white text-gray-900 hover:bg-gray-100 text-lg md:text-xl font-semibold py-4 px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-gray-300 focus:outline-none">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm md:text-base">
            No credit card required • Free to start • Secure & encrypted
          </p>
        </div>

        {/* Stats or testimonials */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-300 text-sm md:text-base">Active Users</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">$2M+</div>
            <div className="text-gray-300 text-sm md:text-base">Money Tracked</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">95%</div>
            <div className="text-gray-300 text-sm md:text-base">User Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
