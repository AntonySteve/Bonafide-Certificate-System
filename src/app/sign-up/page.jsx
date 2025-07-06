'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/lib/store/userSlice';

export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch();
                               
  const [data, setData] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState({otp: ''});
  const [step, setStep] = useState(1); // 1 = form, 2 = otp
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

  const handleOTP = (e) => {
    const { name, value } = e.target;
    setOtp((prev) => ({ ...prev, [name]: value }));
    console.log(otp);
  }

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

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!data.email.endsWith('@psnacet.edu.in')) {
      return setError('Only @psnacet.edu.in emails are allowed.');
    }

    setLoading(true);
    setError('');


    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to send OTP');

      setStep(2); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
  setLoading(true);
  setError('');

  try {
    const verifyResponse = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, otp: otp.otp }),
    });

    const verifyResult = await verifyResponse.json();

    if (!verifyResponse.ok) {
      throw new Error(verifyResult.message || 'OTP verification failed');
    }

    const signUpResponse = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const signUpResult = await signUpResponse.json();

    if (!signUpResponse.ok) {
      throw new Error(signUpResult.message || 'Failed to sign up');
    }

    dispatch(setUser(signUpResult.user));  
    handleNavigation(signUpResult.user.email);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full"
        onSubmit={step === 1 ? handleSendOTP : (e) => e.preventDefault()}
      >
        <div className="flex justify-center mb-6">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.taQ0TK0ptqzVYC2--aQFigHaG6?cb=thvnextc1&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Logo"
            className="w-40 h-40"
          />
        </div>

        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Username</label>
              <input
                type="text"
                name="username"
                placeholder='Enter your username'
                value={data.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder='Enter your email'
                value={data.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder='Enter your password'
                value={data.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Enter OTP   
                <span className='text-gray-700 font-semibold text-md'>      within 2 minutes</span>
              </label>
              <input
                type="text"
                placeholder='Enter your OTP'
                name="otp"
                value={otp.otp}
                onChange={handleOTP}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}                                  

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button           
          type={step === 1 ? 'submit' : 'button'}
          onClick={step === 2 ? handleVerifyOTP : undefined}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700 transition"
        >
          {loading                         
            ? step === 1
              ? 'Signing Up..'
              : 'Verifying...'
            : step === 1
            ? 'Sign Up'
            : 'Verify & Sign Up'}
        </button>
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => router.push('/login')}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
