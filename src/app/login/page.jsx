'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/lib/userSlice';

export default function Login() {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const tutors = ["tutora@psnacet.edu.in", "tutorb@psnacet.edu.in", "tutorc@psnacet.edu.in", "tutord@psnacet.edu.in"]
  const [error, setError] = useState('');
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data)
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push('/sign-up');
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!data.email.endsWith('@psnacet.edu.in')) {
      setError('Only @psnacet.edu.in emails are allowed.');
      return;
    }
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json();

      console.log(result);
      dispatch(setUser(result.user));
      if (result.user && tutors.includes(result.user.email)) {
        router.push('/tutor');
      } else {
        router.push('/student');
      }

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="https://www.wemakescholars.com/admin/uploads/providers/dXALXBZDSIJRjYu-lFo5oZXxQRcmrfw9.webp" alt="Logo" className="w-40 h-40" />
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
            className="w-full p-2 border rounded placeholder-gray"
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
            className="w-full p-2 border rounded placeholder-gray"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Sign In
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p>Don't have an account?</p>
          <button className="text-blue-600 hover:underline " onClick={handleClick}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}