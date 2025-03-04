'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '@/components/ui/loader';

export default function HodPage() {
  const user = useSelector((state) => state.user);
  const [hod, setHod] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHod = useCallback(async () => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/hodfetch', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch HOD requests');
      }

      const data = await response.json();
      setHod(data.hod || []);
    } catch (err) {
      console.error('Error fetching HOD requests:', err);
      setError('Failed to load HOD requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchHod();
  }, [fetchHod]);

  const handleRequest = async (url, method, body, successMessage, failureMessage) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(failureMessage);

      alert(successMessage);
      fetchHod();
    } catch (error) {
      console.error(failureMessage, error);
      alert(failureMessage);
    }
  };

  const handleAccept = (hodRequest) => {
    const payload = {
      studentName: hodRequest.studentName,
      studentRegNo: hodRequest.regNo,
      studentEmail: hodRequest.studentEmail,
      tutorName: hodRequest.tutorName,
      inchargeName: hodRequest.inchargeName,
      reason: hodRequest.reason,
    };
    handleRequest('/api/hod', 'POST', payload, 'Request accepted successfully.', 'Failed to accept the request.');
    handleRequest('/api/hoddelete', 'DELETE', { postId: hodRequest._id }, '');
    handleRequest('/api/sendHodEmail', 'POST', {
      ...payload,
      studentEmail: hodRequest.studentEmail,
    }, 'Email sent successfully.');
  };

  const handleDecline = (hodRequest) => {
    handleRequest(
      '/api/hoddelete',
      'DELETE',
      { postId: hodRequest._id },
      'Request declined successfully.',
      'Failed to decline the request.'
    );
  };

  if (loading) return <Loader message="Loading HOD requests..." />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-3xl font-semibold text-gray-700 mb-8 text-center">HOD Requests</h1>

      {hod.length === 0 ? (
        <p className="text-center text-2xl text-semibold text-black">No HOD requests found.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {hod.map((hodRequest) => (
            <div
              key={hodRequest._id}
              className="bg-white shadow-lg rounded-xl p-8 flex justify-between items-start transition-transform transform hover:scale-105"
            >
              <div>
                <h2 className="text-xl font-medium text-gray-900">{hodRequest.studentName}</h2>
                <p className="text-gray-600">Reg No: {hodRequest.regNo}</p>
                <p className="text-gray-600">Tutor: {hodRequest.tutorName}</p>
                <p className="text-gray-600">Incharge: {hodRequest.inchargeName}</p>
                <p className="text-gray-600 mt-2">Reason: {hodRequest.reason}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAccept(hodRequest)}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleDecline(hodRequest)}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}