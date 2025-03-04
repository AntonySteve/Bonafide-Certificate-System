'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/lib/store/userSlice';

export default function SignUp() {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tutors = ["tutora@psnacet.edu.in", "tutorb@psnacet.edu.in", "tutorc@psnacet.edu.in", "tutord@psnacet.edu.in"];
  const incharges = ["year1@psnacet.edu.in", "year2@psnacet.edu.in", "year3@psnacet.edu.in", "year4@psnacet.edu.in"];
  const hod = "hod@psnacet.edu.in";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavigation = (role) => {
    switch (role) {
      case 'hod':
        router.push('/hod');
        break;
      case 'incharge':
        router.push('/incharge');
        break;
      case 'tutor':
        router.push('/tutor');
        break;
      default:
        router.push('/student');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!data.email.endsWith('@psnacet.edu.in')) {
      setError('Only @psnacet.edu.in emails are allowed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Sign up failed');
      }

      dispatch(setUser(result.user));

      if (result.user.email === hod) {
        handleNavigation('hod');
      } else if (incharges.includes(result.user.email)) {
        handleNavigation('incharge');
      } else if (tutors.includes(result.user.email)) {
        handleNavigation('tutor');
      } else {
        handleNavigation('student');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full" onSubmit={handleSignUp}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://www.wemakescholars.com/admin/uploads/providers/dXALXBZDSIJRjYu-lFo5oZXxQRcmrfw9.webp"
            alt="Logo"
            className="w-40 h-40"
          />
        </div>

        {/* Username Input */}
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 font-semibold">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={data.username}
            onChange={handleChange}
            className="w-full p-2 border rounded placeholder-gray"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
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
          <label htmlFor="password" className="block mb-2 font-semibold">Password</label>
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

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer transition"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {/* Sign In Link */}
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <button
            type="button"
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}