import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="text-white">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10 px-4 sm:px-6 rounded-lg shadow-xl mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to DishDash</h1>
        <p className="text-gray-100">Manage your restaurant data with ease</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Places Card */}
        <Link to="/places" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h2 className="text-xl font-semibold mb-2">Places</h2>
            <p className="text-gray-300 text-sm">Manage your restaurant locations</p>
          </div>
        </Link>

        {/* Collections Card */}
        <Link to="/collections" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <h2 className="text-xl font-semibold mb-2">Collections</h2>
            <p className="text-gray-300 text-sm">Organize your menu collections</p>
          </div>
        </Link>

        {/* Tags Card */}
        <Link to="/tags" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <p className="text-gray-300 text-sm">Manage tags for your menu items</p>
          </div>
        </Link>

        {/* Stories Card */}
        <Link to="/stories" className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h2 className="text-xl font-semibold mb-2">Stories</h2>
            <p className="text-gray-300 text-sm">Create and manage your stories</p>
          </div>
        </Link>
      </div>

      <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">25</div>
            <div className="text-gray-300 text-sm">Active Places</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">120</div>
            <div className="text-gray-300 text-sm">Menu Items</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">32</div>
            <div className="text-gray-300 text-sm">Tags</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">8</div>
            <div className="text-gray-300 text-sm">Stories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 