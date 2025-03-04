import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); 
  const [active, setActive] = useState('Dashboard'); 

 
  useEffect(() => {
    const currentPath = location.pathname.replace('/', '') || 'Dashboard';
    setActive(currentPath);
  }, [location]);

  const handleClick = (section) => {
    setActive(section);
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

