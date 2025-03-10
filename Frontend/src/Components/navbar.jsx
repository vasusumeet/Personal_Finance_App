import React, { useState, useEffect, useContext} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { User, ChevronDown, ChevronUp } from 'lucide-react';

function Navbar() {
  const location = useLocation(); 
  const [active, setActive] = useState('Dashboard'); 
  const { user } = useContext(UserContext); 
  const [isOpen, setIsOpen] = useState(false);
 
  useEffect(() => {
    const currentPath = location.pathname.replace('/', '') || 'Dashboard';
    setActive(currentPath);
  }, [location]);

  const handleClick = (section) => {
    setActive(section);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">{active}</h1> {}
        <div className="flex space-x-4">
          <Link
            to="/Dashboard"
            className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black ${active === 'Dashboard' ? 'bg-gray-900' : ''}`}
            onClick={() => handleClick('Dashboard')}
          >
            Dashboard
          </Link>
          <Link
            to="/Expenses"
            className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black ${active === 'Expenses' ? 'bg-gray-900' : ''}`}
            onClick={() => handleClick('Expenses')}
          >
            Expenses
          </Link>
          <Link
            to="/Savings"
            className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black ${active === 'Saving' ? 'bg-gray-900' : ''}`}
            onClick={() => handleClick('Saving')}
          >
            Saving
          </Link>
          <Link
            to="/Salary"
            className={`text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black ${active === 'Salary' ? 'bg-gray-900' : ''}`}
            onClick={() => handleClick('Salary')}
          >
            Salary
          </Link>
          <div className="relative">
        <button
          className="flex items-center gap-2 text-white"
          onClick={toggleDropdown}
        >
          <User className="w-6 h-6" />
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && user && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
            <p className="px-4 py-2 text-sm text-gray-800">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="px-4 py-2 text-sm text-gray-800">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </div><button>

          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

