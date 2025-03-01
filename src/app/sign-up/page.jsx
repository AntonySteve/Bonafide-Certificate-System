'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/lib/userSlice';


export default function SignUp() {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const router = useRouter()
  const [error, setError] = useState('');
  const dispatch = useDispatch(); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data)
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/login');
  }


  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!data.email.endsWith('@psnacet.edu.in')) {
      setError('Only @psnacet.edu.in emails are allowed.');
      return;
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers :
        {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log(result);
      dispatch(setUser(result.user));
    } catch (error) {
      console.log(error)
    }
    
    cons
    setError('');
    console.log('Form submitted', data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full" onSubmit={handleSignUp}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
        <img src="https://www.wemakescholars.com/admin/uploads/providers/dXALXBZDSIJRjYu-lFo5oZXxQRcmrfw9.webp" alt="Logo" className="w-40 h-40" />
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
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Sign Up
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <button className="text-blue-600 hover:underline" onClick={handleClick}>Sign in</button>
        </div>
      </form>
    </div>
  );
}