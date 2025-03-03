'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <div
    className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
    style={{ backgroundImage: "url('Desktop - 2-fotor.png')", backgroundSize: "cover", backgroundPosition: "center",filter:"brightness(1.0) contrast(0.8)" }} // Background Image
  >
    <img src="./Desktop - 2" alt="" />
      {/* College Logo & Name (Top of the Page) */}
      <div className="absolute top-8 flex flex-col items-center">
        <img
          src="https://psnacet.edu.in/images/logo-white.png"// Change this to your logo's path
          alt="College Logo"
          className="w-50 h-50 md:w-150 md:h-40 mb-100"
        />
        <motion.h2
          className="text-2xl font-bold text-white text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        </motion.h2>
      </div>

      {/* Main Content (Heading & Login Button) */}
      <header className="w-full max-w-lg text-center">
        <motion.h1
          className="text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to E-Bonafide Certificate System
        </motion.h1>

        <motion.button
          onClick={handleClick}
          className="px-6 py-3 bg-white text-blue-600 font-semibold text-lg rounded-full shadow-lg hover:bg-gray-200 transition-transform transform scale-100 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Login
        </motion.button>
      </header>
    </div>
  );
}
