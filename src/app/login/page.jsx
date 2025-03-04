'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/lib/store/userSlice';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const userRoles = {
    hod: 'hod@psnacet.edu.in',
    incharges: [
      'year1@psnacet.edu.in',
      'year2@psnacet.edu.in',
      'year3@psnacet.edu.in',
      'year4@psnacet.edu.in',
    ],
    tutors: [
      'tutora@psnacet.edu.in',
      'tutorb@psnacet.edu.in',
      'tutorc@psnacet.edu.in',
      'tutord@psnacet.edu.in',
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavigation = (email) => {
    if (email === userRoles.hod) {
      router.push('/hod');
    } else if (userRoles.incharges.includes(email)) {
      router.push('/incharge');
    } else if (userRoles.tutors.includes(email)) {
      router.push('/tutor');
    } else {
      router.push('/student');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!data.email.endsWith('@psnacet.edu.in')) {
      setError('Only @psnacet.edu.in emails are allowed.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials. Please try again.');
      }

      const result = await response.json();

      if (!result.user) {
        throw new Error('User not found. Please check your credentials.');
      }

      dispatch(setUser(result.user));
      handleNavigation(result.user.email);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full" onSubmit={handleSignIn}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://www.wemakescholars.com/admin/uploads/providers/dXALXBZDSIJRjYu-lFo5oZXxQRcmrfw9.webp"
            alt="Logo"
            className="w-40 h-40"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-2 border rounded placeholder-gray"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={handleChange}
            className="w-full p-2 border rounded placeholder-gray"
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Sign In Button */}
        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} cursor-pointer transition duration-200`}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push('/sign-up')}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}