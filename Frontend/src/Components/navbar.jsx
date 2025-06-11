import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { User, ChevronDown, ChevronUp, LogOut, Menu, X } from 'lucide-react';

function Navbar() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [active, setActive] = useState('Dashboard'); 
  const { user, setUser } = useContext(UserContext); 
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
  useEffect(() => {
    const currentPath = location.pathname.replace('/', '') || 'Dashboard';
    setActive(currentPath);
  }, [location]);

  const handleClick = (section) => {
    setActive(section);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/'); 
  };

  const navLinks = [
    { to: '/Dashboard', label: 'Dashboard', key: 'Dashboard' },
    { to: '/Expenses', label: 'Expenses', key: 'Expenses' },
    { to: '/Savings', label: 'Savings', key: 'Savings' },
    { to: '/Salary', label: 'Income', key: 'Salary' }
  ];

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-white text-xl md:text-2xl font-bold">
              <span className="md:hidden">💰</span>
              <span className="hidden md:inline">Personal Finance</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.to}
                className={`text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-700 ${
                  active === link.key ? 'bg-gray-900' : ''
                }`}
                onClick={() => handleClick(link.key)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Desktop User Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 text-white hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"
                onClick={toggleUserDropdown}
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">{user?.username}</span>
                {isUserDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isUserDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:bg-gray-700 p-2 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  className={`block text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-700 ${
                    active === link.key ? 'bg-gray-900' : ''
                  }`}
                  onClick={() => handleClick(link.key)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {user && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
