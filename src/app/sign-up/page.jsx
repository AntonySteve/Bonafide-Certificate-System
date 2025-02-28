'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [data, setData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const router = useRouter()
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data)
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/login');
  }

/*************  ✨ Codeium Command 🌟  *************/
  /**
   * Handle the sign-in form submission.
   * @param {Event} e The form submission event.
   */
  const handleSignUp = (e) => {
    e.preventDefault();

    // Check if the email ends with @psnacet.edu.in
    if (!data.email.endsWith('@psnacet.edu.in')) {
      setError('Only @psnacet.edu.in emails are allowed.');
      return;
    }

    setError('');
    console.log('Form submitted', data);
    // Add your authentication logic here
  };
/******  dca3eae7-7ac2-41ce-9a78-2a9ee9f2d3b1  *******/

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-20 h-20" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={data.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>


        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Sign In Button */}
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <button className="text-blue-600 hover:underline" onClick={handleClick}>Sign IN</button>
        </div>
      </form>
    </div>
  );
}