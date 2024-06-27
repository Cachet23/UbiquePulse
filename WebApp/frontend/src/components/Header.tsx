import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-blue-600 w-full py-2 md:py-6 text-white text-center shadow-md flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-xl md:text-3xl font-bold">MQTT Client Dashboard</h1>
      <button onClick={onMenuClick} className="focus:outline-none mt-4 md:mt-0">
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
    </header>
  );
};

export default Header;